//!function() {


!function(Date) {
  Date.prototype.toStr = function() {
    var id = [this.getFullYear(), this.getMonth() + 1, this.getDate()]
    return id.join('-')
  }
  Date.prototype.neighbor = function(t) {
    var date = new Date(this)
    date.setDate(date.getDate() + t)
    return date
  }
  Date.strToDate = function(s) {
    //check if it is valid
    //TODO
    var date = s.split('-')
    var year = parseInt(date[0])
    var month = parseInt(date[1]) - 1
    var day = parseInt(date[2])
    return new Date(year, month, day)
  }
}(Date)

//event router
!function(window, jQuery) {

  function EventRouter() {

    var eventStack = {}

    this.on = function(e, func) {
      if (eventStack[e] == undefined) {
        eventStack[e] = []
      }
      eventStack[e].push(func)
    }

    this.trigger = function(e) {
      window.console.log('event ' + e + ' triggered')
      if (eventStack[e] != undefined) {
        _.each(eventStack[e], function(func) {
          func()
        })
      }
    }
  }
  $.eventRouter = new EventRouter()
  window.EventRouter = EventRouter

}(window, jQuery)

function updateConfig(config, newConfig) {
  for (var key in config) {
    if (newConfig[key] != undefined) {
      if (config[key] instanceof Array) {
        //if config[key] is array, extend it 
        newConfig[key] instanceof Array ?
          _.extend(config[key], newConfig[key]) : 
                   config[key].push(newConfig[key])
      } else {
        //or replace it
        config[key] = newConfig[key]
      }
    }
  }
  for (var key in newConfig) {
    if (config[key] == undefined) {
      config[key] = newConfig[key]
    }
  }
  return config
}

function TimeLine(config) {
  /* --- settings --- */
  var defaultConfig = {
    currentDate: new Date()
  }
  var config  = config != undefined ? 
                updateConfig(defaultConfig, config) : defaultConfig

  /* --- local variable --- */
  var ev = new EventRouter()
  var events = {
    dateChanged: 't1.dateChanged'
  }
  var currentDate = this.currentdate = config.currentDate

  /* --- function start --- */
  function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1)
    ev.trigger(events.dateChanged)
    return currentDate
  }

  function previousDay() {
    currentDate.setDate(currentDate.getDate() - 1)
    ev.trigger(events.dateChanged)
    return currentDate
  }

  function setDate(date) {
    if (date instanceof Date) {
      currentDate == date
    } else {
      currentDate = Date.strToDate(date)
    }
    ev.trigger(events.dateChanged)
    return currentDate
  }

  function neighbors(t) {
    var r = _.range(-parseInt(t / 2), parseInt(t / 2) + 1)
    return _.map(r, function(d) {
      return currentDate.neighbor(d)
    })
  }

  function predays(t) {
    var r = _.range(-t, 0)
    return _.map(r, function(d) {
      return currentDate.neighbor(d)
    })
  }

  function onChanged(func) {
    ev.on(events.dateChanged, function() {
      func(currentDate)
    })
  }
  /* --- function end --- */

  /* --- api start --- */
  this.onChanged = onChanged
  this.nextDay = nextDay
  this.previousDay = previousDay
  this.setDate = setDate
  this.neighbors = neighbors
  this.predays = predays
  /* --- api end --- */
  
}

function TimeLineUI(config) {
  /* --- set config --- */
  var defaultConfig = {
    showedNum: 30 
    , id: '#timeline'
  }
  var config  = config != undefined ? 
                updateConfig(defaultConfig, config) : defaultConfig

  /* --- set local --- */
  var timeLine = new TimeLine()
  timeLine.onChanged(function() {
    //show()
  })
  
  /* --- function start --- */
  function buildDateUI(date) {
    var dli = '<li class="date" id="' + date.toStr() 
                + '" data-date="' + date.toStr() + '">' 
                + date.toStr() + '</li>'
    return dli
  }

  function init() {
    $(config.id).append('<div class="pre">previous</div>')
    $(config.id).append('<div class="timeline-inner"><ul class="datelist clearfix"></ul></div>')
    $(config.id).append('<div class="next">next</div>')
    var dateList = timeLine.predays(config.showedNum)
    dateList = _.map(dateList, buildDateUI)
    $(".timeline-inner ul").prepend(dateList.join(''))
  }
  function bindEvent() {
    $('.pre').click(function() {
      timeLine.previousDay()
    })
    $('.next').click(function() {
      timeLine.nextDay()
    })
    /*
    $('.date').click(function() {
      timeLine.setDate($(this).data('date'))
    })
    */
    $('.timeline-inner').drag(function(e) {
      $(this).css('left', event.offsetX)
    })
  }

  /* --- function end --- */
  init()
  bindEvent()
}


//}()
