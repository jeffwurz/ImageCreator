angular.module('ImageCreator')
  .controller('SVGCtrl', function ($scope) {
    'use strict';
    $scope.points = [];
    $scope.prev_mode = 0;
    $scope.prev_shape = 0;
    $scope.angle = 0;
    $scope.size = {'width': 750, 'height': 750}
    $scope.draw = SVG('drawing').size($scope.size.width, $scope.size.height).fill('#FFF')
    $scope.generateImage = function() {
      switch($scope.mode.id){
        case 'c' : concentric(); break;
        case 'f' : first(); break;
        case 'ff': fillFrame(); break;
      }
      $scope.prev_mode = $scope.mode.id;
      $scope.prev_shape = $scope.shape.id;
    };

    function first () {
      if($scope.mode.id != $scope.prev_mode && $scope.shape.id != $scope.prev_shape){$scope.points = []; generatePointList();}
      $scope.draw.rect($scope.size.width, $scope.size.height).fill('#000')
      for(var p in $scope.points) {
        console.log("P = " + p);
        var colors = $scope.color.name.split(',');
        var radii  = $scope.radius.name.split(',');
        var c = colors[getRandomArbitrary(0, colors.length)];
        var r = radii[getRandomArbitrary(0, radii.length)];
        makeShape($scope.points[p].x, $scope.points[p].y, c, r);
      }
    };

    function concentric () {
      if($scope.mode.id != $scope.prev_mode && $scope.shape.id != $scope.prev_shape){$scope.points = []; generateFillList();}
      $scope.draw.rect($scope.size.width, $scope.size.height).fill('#000')
      for(var p in $scope.points) {
        console.log("P = " + p);
        var colors = $scope.color.name.split(',');
        var radii  = $scope.radius.name.split(',');
        radii.reverse().forEach(function (r){
          var c = colors[getRandomArbitrary(0, colors.length)];
          makeShape($scope.points[p].x, $scope.points[p].y, c, r);
        });
      }
    };

    function fillFrame () {
      if($scope.mode.id != $scope.prev_mode && $scope.shape.id != $scope.prev_shape){$scope.points = [];generateFillList();}
      $scope.draw.rect($scope.size.width, $scope.size.height).fill('#000')
      for(var p in $scope.points) {
        console.log("P = " + p);
        var colors = $scope.color.name.split(',');
        var radii  = $scope.radius.name.split(',');
        var mx = 0, my = 0;
        switch($scope.shape.id) {
          case 'T':  $scope.angle +=180; break;
          default: $scope.angle += 180;
        }
        radii.reverse().forEach(function (r){
          var c = colors[getRandomArbitrary(0, colors.length)];
          makeShape($scope.points[p].x, $scope.points[p].y, c, r);
        });
      }
    };

    function generatePointList () {
      var p = $scope.pitch.name.split(',');
      var xp = p[getRandomArbitrary(0, p.length)];
      var yp = p[getRandomArbitrary(0, p.length)];
      for(var x = Math.min.apply(null, p); x <= ($scope.size.width - Math.min.apply(null, p)); x = +x + +xp){
        xp = p[getRandomArbitrary(0, p.length)];
        for(var y = Math.min.apply(null, p); y <= ($scope.size.height - Math.min.apply(null, p)); y = +y + +yp){
          yp = p[getRandomArbitrary(0, p.length)];
          $scope.points.push({x: x, y: y});}}
    };

    function generateFillList (m) { //Generates a list of points to fill an area with a shape covering a 2d space.
      var i = 0;
      var m = $scope.mode.id;
      var r = $scope.radius.name.split(',');
      var radius = Math.max.apply(null, r);
      var mx = 0, my = 0;
      switch($scope.shape.id) {
        case 'C':  mx=1; my=1; break;
        case 'T':  if(m == 'c'){mx=1; my=1;}else{mx=0.5; my=1;}break;
        case 'R':  mx=.618; my=1; break;
        case 'L':  mx=.103; my=1; break;
        case 'E':  mx=1; my=4; break;
        case 'O':  mx=1; my=1; break;
        case 'M':  mx=1; my=3; break;
        default: mx=2; my=2;
      }
      for(var x = 0; x < $scope.size.width + mx*radius; x = +x + mx * radius){
        for(var y = 0; y < $scope.size.height + my*radius; y = +y + my * radius){
          $scope.points.push({x: x, y: y});
          console.log(x, y);
        }
      }
    }

    function makeShape (x, y, c, r) {
      var poly;
      if($scope.angle >= 360){$scope.angle -= 360;}
      var a = $scope.angle;
      var id;
      if($scope.shape.id == 'M'){id = $scope.form0.shapeList[Math.floor(Math.random()*($scope.form0.shapeList.length-1))].id;}
      else{id = $scope.shape.id;}
      switch(id) {
        case 'C':  $scope.draw.circle(r).cx(x).cy(y).fill(c); break;
        case 'T':
          if(a==0)       {poly = [[x+.5*r,y+.5*r], [x,y-.5*r], [x-.5*r,y+.5*r]];}
          else if(a==180){poly = [[x-.5*r,y-.5*r], [x,y+.5*r], [x+.5*r,y-.5*r]];}
          $scope.draw.polygon(poly).fill(c); break;
        case 'R':  $scope.draw.rect(.618*r, r).cx(x).cy(y).fill(c); break;
        case 'L':
          $scope.draw.line(x, y-1*r, x, y+1*r).
          stroke({ width: .103*r , color: c}).transform({rotation: a, relative: true});
          break;
        case 'E':  $scope.draw.ellipse().attr({cx: x, cy:y, rx: .5*r, ry: 2*r}).fill(c); break;
        case 'O':
          poly = [[x+.5*r,y+.167*r], [x+.5*r,y-.167*r], [x+.167*r,y-.5*r], [x-.167*r,y-.5*r],
                  [x-.5*r,y-.167*r], [x-.5*r,y+.167*r], [x-.167*r,y+.5*r], [x+.167*r,y+.5*r]];
          $scope.draw.polygon(poly).fill(c); break;
        default: mx=2; my=2;
      }
    };

    function getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    $scope.form = {
      'modeList': [
        { name: 'First', id: 'f'},
        { name: 'Concentric', id: 'c'},
        { name: 'Fill Frame', id: 'ff'}
      ]
    };
    $scope.form0 = {
      'shapeList': [
        { name: 'Circle', id: 'C'},
        { name: 'Triangle', id: 'T'},
        { name: 'Rectangle', id: 'R'},
        { name: 'Line', id: 'L'},
        { name: 'Ellipse', id: 'E'},
        { name: 'Octagon', id: 'O'},
        { name: 'Random', id: 'M'}
      ]
    };
    $scope.form1  = {
      'colorList': [
        { name: '#FFFF66, #FFCC00, #FF9900, #FF0000', id: '1'},
        { name: '#E8D0A9, #B7AFA3, #C1DAD6, #F5FAFA, #ACD1E9, #6D929B', id: '2'},
        { name: '#999967, #666666, #CCCCCC, #CCCC9A', id: '3'},
        { name: '#336699, #666666, #999999', id: '4'},
        { name: '#BED661, #89E894, #78D5E3, #7AF5F5, #34DDDD, #93E2D5', id: '5'},
        { name: '#FF3333, #999999, #669999, #003333', id: '6'},
        { name: '#153450, #294052, #447294, #8FBCDB, #F4D6BC, #F8E4CC', id: '7'},
        { name: '#B7C68B, #F4F0CB, #DED29E, #B3A580, #685642', id: '8'},
        { name: '#7EB5D6, #2A75A9, #274257, #DFC184, #8F6048, #644436', id: '9'},
        { name: '#6699CC, #003366, #C0C0C0, #000044', id: '10'},
        { name: '#CCCCCC, #000000, #FF6600', id: '11'},
        { name: '#129793, #505050, #FFF5C3, #9BD7D5, #FF7260', id: '12'},
        { name: '#6BCAE2, #51A5BA, #41924B, #AFEAAA, #87E293, #FE8402', id: '13'},
        { name: '#7D9C9F, #BDD8DA, #DFEFF0, #AD235E, #ECECEC, #B1B1B1', id: '14'},
        { name: '#003366, #CCCCCC, #FFCC00', id: '15'},
        { name: '#333333, #FFCC00, #669966, #993366', id: '16'},
        { name: '#74A6BD, #7195A3, #D4E7ED, #EB8540, #B06A3B, #AB988B', id: '17'},
        { name: '#A31E39, #485C5A, #8C9C9A, #9DB2B1, #BFCFCC, #D6E4E1', id: '18'},
        { name: '#1C263C, #313C53, #455268, #B6C0D2, #9CFF00, #FFFFFF', id: '19'},
        { name: '#006400, #B0C4DE, #0099CC, #CCFFFF', id: '20'},
        { name: '#154890, #6699FF, #CDBFAC, #E1D4C0, #F5EDE3, #FF6600', id: '21'},
        { name: '#000044, #555555, #444444, #333333', id: '22'},
        { name: '#D9CCB9, #DF7782, #E95D22, #017890, #613D2D', id: '23'},
        { name: '#FDB813, #F68B1F, #F17022, #62C2CC, #E4F6F8, #EEF66C', id: '24'},
        { name: '#561420, #821122, #C59A6F, #333333, #CCCCCC, #FCFCFC', id: '25'},
        { name: '#FDEDD0, #BCF1ED, #FF634D, #FD795B', id: '26'},
        { name: '#7C786A, #8DCDC1, #D3E397, #FFF5C3, #EB6E44', id: '27'},
        { name: '#CEEBFB, #A3D6F5, #66A7C5, #EE3233, #F0ECEB, #6C7476', id: '28'},
        { name: '#CE0000, #000063, #5A79A5, #9CAAC6, #DEE7EF', id: '29'},
        { name: '#020731, #3862C6, #6E7587, #806641, #AE956D', id: '30'},
        { name: '#EBC137, #E38C2D, #DB4C2C, #771E10, #48110C', id: '31'},
        { name: '#FF9900, #336688, #FFCC00', id: '32'},
        { name: '#00FF00, #004040, #D0CA9C, #000000', id: '33'},
        { name: '#2D3956, #455372, #616A7F, #E7E7E7, #E0E9E9, #FF1A00', id: '34'},
        { name: '#668E39, #96B566, #BCE27F, #7C7C7C, #C3C3C3, #F6FF97', id: '35'},
        { name: '#E96D63, #7FCA9F, #F4BA70, #85C1F5, #4A789C, #FCFEFD', id: '36'},
        { name: '#9C9284, #CCCC99, #E6E6CC, #6699CC, #FF9900, #000000', id: '37'},
        { name: '#9DAF72, #566047, #562F32, #462D44, #859731, #640E27', id: '38'},
        { name: '#CC6600, #6699CC, #99CCFF, #CAE5FF, #DCDCDC, #EEEEEE', id: '39'},
        { name: '#F1433F, #F7E967, #A9CF54, #70B7BA, #3D4C53', id: '40'},
        { name: '#004489, #E1E1D6, #D3D9DF, #989898, #565656, #DBDBCE', id: '41'},
        { name: '#02243C, #005DB3, #5195CE, #E6E6E6, #F9F9F9, #5BC236', id: '42'},
        { name: '#006666, #9DBCBC, #FFCC66, #FFEEBB, #6B6B6B, #B7B7B7', id: '43'},
        { name: '#2B3E42, #747E80, #D5E1DD, #F7F3E8, #F2583E, #77BED2', id: '44'},
        { name: '#054950, #789A9F, #EDF4F5, #FFFFFF, #F78F1E', id: '45'},
        { name: '#FF8F00, #5A8F29, #3C7DC4, #2B2B2B', id: '46'},
        { name: '#0A4958, #01B6AD, #F6E7D2, #FFFFFF', id: '47'}
      ]
    };
    $scope.form2  = {
      'pitchList': [
        { name: '32,42,46,54,60,64,70', id: '1'},
        { name: '20,22,24,28,30,34,44,54', id: '2'},
        { name: '20,22,28,30,32,65', id: '3'},
        { name: '20,30,32,40,60', id: '4'},
        { name: '10,15,25,37,40', id: '5'},
        { name: '15,19,26,39', id: '6'},
        { name: '20,28,32,36', id: '7'}
      ]
    };
    $scope.form3  = {
      'radiusList': [
        { name: '1,1,2,3,4,5,8,13,21,34', id: '1'},
        { name: '1,2,4,8,21,34', id: '2'},
        { name: '4,5,6,7,10,11,13,14,15', id: '3'},
        { name: '1,2,3,4,5,8,13,21', id: '4'},
        { name: '9,10,12,13,14,15', id: '5'},
        { name: '4,5,6,7,8,9,10', id: '6'},
        { name: '3,5,7,11,13,15', id: '7'},
        { name: '5,8,13,21,34', id: '8'},
        { name: '7,11,15,20', id: '9'},
        { name: '5,8,13,21', id: '10'},
        { name: '5,6,7,8,9', id: '11'}
      ]
    };
  });
