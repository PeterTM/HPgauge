function HPgauge(canvas, options) {
    this.options = Util.extend({}, HPgauge.defaultOptions, options);
    this.canvas = canvas;
    this.value = 1.0;
    this.curvalue = 0.0
    this.upincrementer = .1;
    this.dnincrementer = .1;
    //this.redraw(canvas)
    this.animate();
  };

HPgauge.defaultOptions = {
      range_high: 250,
      range_low: 0,
      warn_high: 200,
      warn_low: 100,
      norm_high: 100,
      norm_low: 0,
      ideal_high: 75,
      ideal_low: 35,
      col_warn: "#6c6c6c",
      col_norm: "#FFF",
      col_ideal: "#00ffd1",
      col_marker: "#000",
      col_alarm: "#F00",
    };

HPgauge.prototype.animate = function() {
        //requestAnimationFrame(this.animate.bind(this));
        requestAnimationFrame(() => { this.animate() } );
        this.redraw(this.canvas);
    }

HPgauge.prototype.update = function(value) {
      this.value= value;
      //this.redraw(this.canvas)
    };

HPgauge.prototype.redraw = function(canvas) {
  var ctx = this.canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startwidth = Math.round((this.canvas.width/2))
  startheight = Math.round((this.canvas.height/10)*1)
  endheight = Math.round((this.canvas.height/10)*9)

  barwidth = this.canvas.width * 0.3;
  barheight = endheight - startheight;
  bar_bottom = startheight + barheight;
  range = this.options.range_high - this.options.range_low;

  pixelsperinc = barheight / (this.options.range_high - this.options.range_low);

  warn_start = bar_bottom - (this.options.warn_high * pixelsperinc);
  warn_height = (bar_bottom - (this.options.warn_low * pixelsperinc)) - warn_start

  normal_start = bar_bottom - (this.options.norm_high * pixelsperinc);
  normal_height = (bar_bottom - (this.options.norm_low * pixelsperinc)) - normal_start

  ideal_start = bar_bottom - (this.options.ideal_high * pixelsperinc);
  ideal_height = (bar_bottom - (this.options.ideal_low * pixelsperinc)) - ideal_start

  marker_pos = bar_bottom - (this.curvalue) * pixelsperinc;

  markerwidth = Math.round((this.canvas.width/5)*2)
  markerheight = Math.round((this.canvas.height/10))

  //Draw Basic Bar
  ctx.fillRect(startwidth,startheight-1,barwidth,barheight+2);



  //Draw Warning Range
  ctx.fillStyle=this.options.col_warn;
  ctx.fillRect(startwidth+1,warn_start,barwidth-2,warn_height);

  //Draw Normal Range
  ctx.fillStyle=this.options.col_norm;
  ctx.fillRect(startwidth+1,normal_start,barwidth-2,normal_height);

  //Draw Ideal Range
  ctx.fillStyle=this.options.col_ideal;
  ctx.fillRect(startwidth+1,ideal_start,barwidth-2,ideal_height);

  //Draw Triangle
  this.drawmarker(marker_pos)

  //drawtext
  this.drawtext(this.curvalue, startwidth,startheight * 9.8)

  //drawalarm
  if(this.value > this.options.norm_high || this.value < this.options.norm_low){
    this.drawalarm(1);
  }

  if(this.curvalue < this.value){
    dist = this.value - this.curvalue
    this.curvalue += dist / 10
    }
  if(this.curvalue > this.value){
    dist = this.curvalue - this.value
    this.curvalue -= dist / 10
  }
  if (dist < 0.1 ){
    this.curvalue = this.value
  }


};



HPgauge.prototype.drawmarker = function(marker_pos) {
  var ctx = this.canvas.getContext("2d");
  ctx.fillStyle=this.options.col_marker;

  startpoint_h = startwidth - 2
  startpoint_v = marker_pos
  ctx.beginPath();
  ctx.moveTo(startpoint_h, startpoint_v);
  ctx.lineTo(startpoint_h - markerwidth, startpoint_v + (markerheight/2));
  ctx.lineTo(startpoint_h - markerwidth, startpoint_v - (markerheight/2));
  ctx.lineTo(startpoint_h, startpoint_v);
  ctx.fill();
};

HPgauge.prototype.drawalarm = function(level) {
  var ctx = this.canvas.getContext("2d");

  alarmwidth = Math.round(barwidth*1.4);
  alarmheight = Math.round(barwidth*1.4);
  startpoint_h = Math.round(startwidth + (barwidth/2) - (alarmwidth/2))
  startpoint_v = Math.round(startheight*0.2)

  ctx.fillStyle=this.options.col_alarm;
  ctx.strokeStyle="#000";
  var fontsize = this.canvas.width * 0.25
  ctx.font = (fontsize|0)+ "px Arial";
  ctx.textAlign = "center";
  console.log(startpoint_h, startpoint_v)
  ctx.beginPath();
  ctx.moveTo(startpoint_h, startpoint_v+alarmheight);
  ctx.lineTo(startpoint_h + alarmwidth, startpoint_v+alarmheight);
  ctx.lineTo(startpoint_h + (alarmwidth/2), startpoint_v);
  ctx.lineTo(startpoint_h , startpoint_v+alarmheight);

  //ctx.lineTo(startpoint_h + alarmwidth, startpoint_v);
  //ctx.lineTo(startpoint_h + alarmwidth, startpoint_v + alarmheight);
  //ctx.lineTo(startpoint_h , startpoint_v + alarmheight);
  //ctx.lineTo(startpoint_h , startpoint_v);
  ctx.strokeStyle="#000";
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth=2;
  ctx.textAlign = "center";
  ctx.fillStyle="#000";
  ctx.fillText("!",startwidth + (barwidth/2)+1,startheight*0.75);
};

HPgauge.prototype.drawtext = function(value, x,y) {
  var ctx = this.canvas.getContext("2d");
  var fontsize = this.canvas.width * 0.3
  ctx.font = (fontsize|0)+"px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle="#0012ff";
  ctx.fillText(value.toFixed(2),x,y);

};


var Util = {
    extend: function() {
      arguments[0] = arguments[0] || {};
      for (var i = 1; i < arguments.length; i++)
      {
        for (var key in arguments[i])
        {
          if (arguments[i].hasOwnProperty(key))
          {
            if (typeof(arguments[i][key]) === 'object') {
              if (arguments[i][key] instanceof Array) {
                arguments[0][key] = arguments[i][key];
              } else {
                arguments[0][key] = Util.extend(arguments[0][key], arguments[i][key]);
              }
            } else {
              arguments[0][key] = arguments[i][key];
            }
          }
        }
      }
      return arguments[0];
    },
  };
