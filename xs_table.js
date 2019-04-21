function tableRead (prop) {
  if (prop in this.revHeaders) { return this[this.revheaders[prop]] }
  return this[prop]
}
function tableWrite (prop, value) {
  if (prop in this.revHeaders) { this[this.revheaders[prop]] = value } else { this[prop] = value }
  return true
}

function generate_table2 (data, headers, separator) {
  var s = 0; var l = data.length; var arr = []
  var i = 0; var obj; var c; var str; var key = !(headers && headers.length > 0); var keys = headers || []; var ki
  var sepKey = separator || '\t'
  while (i < l) {
    ki = 0
    obj = {}
    s = data.indexOf('\n', i)
    if (s < 0) s = l
    if (1) {
      while (i < s) {
        k = data.indexOf(sepKey, i)
        if (k < 0) k = s
        if (k > s) k = s
        c = data.charAt(i)
        if (c == sepKey) {
          str = '' // empty cell
        } else {
          var kk = k; var ii = i // de-quote
          if (c == '"') {
            ii = i + 1
            kk = data.indexOf('"', ii)
            while (kk > k && data.charAt(kk + 1) == '"') // for double quotes
            { kk = data.indexOf('"', kk + 2) }
            if (kk > k) k = kk
          }
          str = data.substring(ii, kk)
        }
        if (key) keys.push(str)
        else obj[ki++] = str
        i = k + 1
      }
    }

    if (key == false) arr.push(obj)
    else key = false
    i = s + 1
  }
  arr.headers = keys
  return arr
}

function generate_table (data, headers, forceToNumber) {
  data = data.split('\n')
  var arr = []
  arr.headers = headers
  for (var i = 0; i < data.length; i++) {
    var row = data[i].split('\t')
    if (!arr.headers) {
      arr.headers = headers = row
    } else {
      var o = []
      for (var j = 0; j < arr.headers.length; j++) {
        var val = row[j]
        if (forceToNumber) { // force to number
          var oval = +val
          if (oval.toString() == val) val = oval
        }
        o[j] = val
      }
      arr.push(o)
    }
  }

  return arr
}

//  ========= table =========================
//
//  render an ARRAY of OBJECTS
//  input:  headers - linear array of strings
//  optional hideHeaders, headerFuncs: {display, hidden, render, action}]
//  output: row_render, revHeaders
//
//  render (data, index, row, rowindex, table)
//  action (data, index, row, rowindex, table)
//
//  ========= table =========================
function autoDOM (el, options) {
  var needed = options.total * options.itemHeight
  var scrollTop = el.scrollTop
  var vh = xs_bounds(el).height
  var bottomdiv = document.createElement('div')

  var topdiv = document.createElement('div')
  topdiv.style.width = '1px'
  topdiv.style.height = '0px'
  el.appendChild(topdiv)

  bottomdiv.style.width = '1px'
  bottomdiv.style.height = needed + 'px'
  el.appendChild(bottomdiv)

  if (el.style.position != 'absolute' || el.style.position != 'fixed') { el.style.position = 'relative' }

  function repaint () {
    var tarr = []
    tarr.push(new Date().getTime())
    var nvh = xs_bounds(el).height
    if (needPaint) xs_raf(repaint)
    if (el.scrollTop == scrollTop && vh == nvh) return
    scrollTop = el.scrollTop
    vh = nvh

    var ps = ((vh / options.itemHeight) | 0)
    var beg = (scrollTop / options.itemHeight) | 0
    var end = beg + ps + 1
    var rows = el.querySelectorAll('.vrow'); var begEl

    var extra = ps/2//ps
    beg = Math.max(0, beg - extra)
    end = Math.min(options.total, end + extra)
    if (1 && rows.length) {
      first = rows[0]
      last = rows[rows.length - 1]

      var firstvs
      var lastvs
      for (var i = 0; i < rows.length; i++) {
        var vs = rows[i].virtualScroll
        if (i == 0) firstvs = vs; else firstvs = Math.min(vs, firstvs)
        if (i == 0) lastvs = vs; else lastvs = Math.max(vs, lastvs)
        if (vs < beg || vs > end) { rows[i].remove = true }// el.removeChild(rows[i])
      }

      if (beg >= firstvs && beg < lastvs) beg = Math.max(beg, lastvs)
      if (end < lastvs && end >= firstvs) end = Math.min(end, firstvs)
    }

    var th = beg * options.itemHeight
    for (var i = beg; i < end; i++) {
      var d = options.generate(i)
      d.style.position = 'absolute'
      d.style.top = (i * options.itemHeight) + 'px'
      d.style.left = 0
      d.classList.add('vrow')
      d.virtualScroll = i
      d.remove = false
      el.insertBefore(d, bottomdiv)
    }

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].remove) { el.removeChild(rows[i]) }
    }

    // experimental support for variable height
    if (0 && rows.length) {
      var rows = el.querySelectorAll('.vrow')
      var first = 0; var last = 0
      for (var i = 0; i < rows.length; i++) {
        var vs = rows[i].virtualScroll
        if (i == 0) firstvs = vs; else if (vs < firstvs) { first = i; firstvs = vs }
        if (i == 0) lastvs = vs; else if (vs > lastvs) { last = i; lastvs = vs }
      }
      first = rows[first]
      last = rows[last]
      var fb = xs_bounds(first)
      var eb = xs_bounds(last)

      var top = first.virtualScroll * options.itemHeight
      var bottom = needed - (top + (eb.bottom - fb.top))

      topdiv.style.height = top + 'px'
      bottomdiv.style.height = bottom + 'px'
    }

    tarr.push(new Date().getTime())
    if (options.afterRender) { options.afterRender(el) }
    tarr.push(new Date().getTime())

    // experimental support for variable height
    var ds = []
    if (0 && rows.length) {
      var rows = el.querySelectorAll('.vrow')
      for (var i = 0; i < rows.length; i++) { ds.push(rows[i]) }
      ds = ds.sort(function (a, b) { return a.virtualScroll - b.virtualScroll })
      var beg = ds[0].virtualScroll
      var th = beg * options.itemHeight
      if (1) {
        for (var i = 0; i < ds.length; i++) {
          var d = ds[i]
          d.style.position = 'absolute'
          d.style.top = th + 'px'
          // d.style.top = ((beg+i)*options.itemHeight) + 'px'
          // th += options.itemHeight
          var height = xs_bounds(d).height
          if (options.itemHeight < height) { //grow row height
            options.itemHeight = height
            needed = options.total * options.itemHeight
            bottomdiv.style.height = needed + 'px'
          }
          th += height
        }

        //clean up end
        if (th < needed && beg + ds.length == options.total) {
          needed = th
          bottomdiv.style.height = needed + 'px'
        }
      }
    }

    // el.scrollTop = scrollTop
    vh = xs_bounds(el).height
    tarr.push(new Date().getTime())

    for (var i=1; i<tarr.length; i++)
      tarr[i-1] = tarr[i]-tarr[i-1]
    tarr.length -=1
    console.log ("timing:", tarr)
  } 

  function debounce (func, wait, immediate) {
    var timeout
    return function () {
      var context = this; var args = arguments
      var later = function () {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  };

  var needPaint = false

  if (1) {
    scrollStop(function () {
      needPaint = true
      repaint()
    }, function () {
      needPaint = false
    }, el)
  } else el.addEventListener('scroll', debounce(repaint, 30))
  repaint()

  options.afterRender(el)
}

function renderTable (el, table, firstRowHeader) {
  table.includeRowNumber = true

  el = $(el)
  var headers = firstRowHeader ? table[0] : table.headers
  table.headers = headers
  var row_render
  var hfuncs = table.headerFuncs || {
    display: {},
    hidden: {},
    class: {},
    render: {},
    action: {}
  }
  hfuncs.display = hfuncs.display || {}
  hfuncs.hidden = hfuncs.hidden || {}
  hfuncs.class = hfuncs.class || {}
  hfuncs.render = hfuncs.render || {}
  hfuncs.action = hfuncs.action || {}

  if (!table.revHeaders) { table.revHeaders = headers.xs_reverseIndex(true) }

  // clear table
  var rows = el.find('.cell')
  var hdrs = el.find('.header')
  rows.html('')
  hdrs.html('')
  var cdiv = document.createElement('div')

  // write data
  table.row_render = row_render = table.row_render || []
  if (0) {
    for (var i = firstRowHeader?1:0; i < table.length; i++) { generateRow(i) }
  }

  var listView = rows// new infinity.ListView(rows);

  // render rows
  if (0) {
    for (var i = firstRowHeader?1:0; i < row_render.length && i < 10; i++) {
      row_render[i].dom = true
      listView.append(row_render[i].el)
    }
  } else
  // listView = new HyperList(rows[0], {
  {
    autoDOM(rows[0], {
      itemHeight: 20,
      total: table.length,
      afterRender: afterRender,
      generate: function (index) {
        return generateRow(index)
      }
    })
  }

  // write headers
  var hdr = ''
  if (table.includeRowNumber) { hdr += '<div class="xstbl_hdr xstbl_rowno">#</div>' }
  for (var j = 0; j < headers.length; j++) {
    hdr += '<div class="xstbl_hdr xstbl_data _rotate">' + (hfuncs.display[headers[j]] || headers[j]) + '</div>'
  }
  hdr += ''
  if (!table.hideHeader) {
    hdrs.append(hdr)
    hdrs.append("<div style='min-width:128px'>") // extra padding for header
  }

  function createElementFromHTML (htmlString) {
    cdiv.innerHTML = htmlString
    // Change this to div.childNodes to support multiple top-level nodes
    return cdiv.firstChild
  }
  //= ============================ generateRow
  function generateRow (idx) {
    var i = idx + (firstRowHeader?1:0)
    if (row_render[i]) return row_render[i].el
    var row = '<div class="xstbl_row">'
    var trow = table[i]
    if (table.includeRowNumber) { row += '<div class="xstbl_hdr xstbl_rowno">' + (idx + 1) + '</div>' }
    for (var j = 0; j < headers.length; j++) {
      var h = j// headers[j]
      if (hfuncs.hidden[h]) continue // hidden
      row += '<div class="xstbl_cell xstbl_data' + (hfuncs.class[h] ? +hfuncs.class[h] : '') + '"'
      row += ' data-i="' + i + '" data-j="' + j + '">'
      if (trow && trow[h] !== undefined) { row += (hfuncs.render[h] ? hfuncs.render[h].call(null, trow[h], j, trow, i, table) : trow[h]) }
      row += '</div>'

      //if (h>=0) break;
    }
    row += '</div>'
    var rowel = { el: createElementFromHTML(row), dom: false }
    // rowel.height = rowel.el.measure()
    row_render[i] = rowel
    return rowel.el
  }

  //= ============================ afterRender
  function afterRender () {
    // find max
    var maxw = []
    var r = rows[0]
    for (var j = 0; j < r.children.length; j++) {
      var row = r.children[j]
      for (var i = 0; i < row.children.length; i++) {
        // var w = $(row.children[i]).width()
        var w = parseInt(xs_style(row.children[i]).width) || 0
        maxw[i] = (maxw[i] && maxw[i] > w) ? maxw[i] : w
      }
    }

    hdrs.children().each(function (i, cel) {
      cel.style.minWidth = null // reset headers so they can shrink if necessary
      var w = $(cel).width()
      maxw[i] = (maxw[i] && maxw[i] > w) ? maxw[i] : w
    })

    // for (var i in maxw)
    // maxw[i] = maxw[i] + 'px'

    // set cel widths
    for (var j = 0; j < r.children.length; j++) {
      var row = r.children[j]
      var x = 0
      for (var i = 0; i < row.children.length; i++) {
        /*
          var d = row.children[i]
          d.style.position = 'absolute'
          d.style.left = x + 'px'
          d.style.top = 0
          x+=maxw[i]
          */
        row.children[i].style.minWidth = maxw[i] + 'px'
      }
    }

    hdrs.children().each(function (i, cel) {
      var w = cel.style.minWidth = maxw[i] + 'px'
    })
  }
  afterRender()

  // match scroll for header
  rows[0].addEventListener('scroll', function () {
    hdrs.scrollLeft(this.scrollLeft)
  })
}
