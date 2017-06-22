angular.module('ImageCreator')
  .controller('SVGCtrl', function ($scope) {
    'use strict';
    'use verbose';
    init();

    $scope.generateImage = function() {
      regenerateList();
      console.log($scope.mode);
      console.log($scope.color);
      console.log($scope.radius);
      console.log($scope.pitch);
      console.log($scope.angle);
      $scope.draw.rect($scope.size.width, $scope.size.height).fill('#000')
      switch($scope.mode){
        case '1' : first(); break;
        case '2' : second(); break;
        case '3' : third(); break;
        case '4' : fourth(); break;
        case '5' : fifth(); break;
        case '6' : sixth(); break;
        case '7' : concentric(); break;
        case '8' : fillFrame(); break;
      }
      savePrevious();
    };

    function first () {
      console.log("first");
      for(var p in $scope.points) {
        var colors = $scope.color.split(',');
        var radii  = $scope.radius.split(',');
        var c = colors[getRandomArbitrary(0, colors.length)];
        var r = radii[getRandomArbitrary(0, radii.length)];
        makeShape($scope.points[p].x, $scope.points[p].y, c, r);
      }
    }

    function second () {
      console.log("second");
      for(var p in $scope.points) {
        var colors = $scope.color.split(',');
        var radii  = $scope.radius.split(',');
        var c = colors[getRandomArbitrary(0, colors.length)];
        var r = radii[getRandomArbitrary(0, radii.length)];
        makeShape($scope.points[p].x, $scope.points[p].y, c, r);
      }
    }

    function third () {
      for(var p in $scope.points) {
        var colors = $scope.color.split(',');
        var radii  = $scope.radius.split(',');
        var c = colors[getRandomArbitrary(0, colors.length)];
        var r = radii[getRandomArbitrary(0, radii.length)];
        if(p % 5 == 0){changeAngle();}
        makeShape($scope.points[p].x, $scope.points[p].y, c, r);
      }
    }

    function fourth () {
      for(var p in $scope.points) {
        var colors = $scope.color.split(',');
        var radii  = $scope.radius.split(',');
        var c = colors[getRandomArbitrary(0, colors.length)];
        var r = radii[getRandomArbitrary(0, radii.length)];
        if(p % 2 == 0 || p % 4 == 0 ){changeAngle();}
        makeShape($scope.points[p].x, $scope.points[p].y, c, r);
      }
    }

    function fifth () {
      for(var p in $scope.points) {
        var colors = $scope.color.split(',');
        var radii  = $scope.radius.split(',');
        var c = colors[getRandomArbitrary(0, colors.length)];
        var r = radii[getRandomArbitrary(0, radii.length)];
        if(p % 5 == 0 || p % 5 == 0){changeAngle();}
        makeShape($scope.points[p].x, $scope.points[p].y, c, r);
      }
    }

    function sixth () {
      for(var p in $scope.points) {
        var colors = $scope.color.split(',');
        var radii  = $scope.radius.split(',');
        var c = colors[getRandomArbitrary(0, colors.length)];
        var r = radii[getRandomArbitrary(0, radii.length)];
        if(p % 3 == 0 || p % 6 == 0 || p % 9 == 0){changeAngle();}
        makeShape($scope.points[p].x, $scope.points[p].y, c, r);
      }
    }

    function concentric () {
      for(var p in $scope.points) {
        var colors = $scope.color.split(',');
        var radii  = $scope.radius.split(',');
        changeAngle();
        radii.reverse().forEach(function (r){
          var c = colors[getRandomArbitrary(0, colors.length)];
          makeShape($scope.points[p].x, $scope.points[p].y, c, r);
        });
      }
    }

    function fillFrame () {
      for(var p in $scope.points) {
        var colors = $scope.color.split(',');
        var radii  = $scope.radius.split(',');
        var mx = 0, my = 0;
        radii.reverse().forEach(function (r){
          var c = colors[getRandomArbitrary(0, colors.length)];
          makeShape($scope.points[p].x, $scope.points[p].y, c, r);
        });
      }
    }

    function generatePointList () {
      var p = $scope.pitch.split(',');
      var xp = p[getRandomArbitrary(0, p.length)];
      var yp = p[getRandomArbitrary(0, p.length)];
      for(var x = Math.min.apply(null, p); x <= ($scope.size.width - Math.min.apply(null, p)); x = +x + +xp){
        xp = p[getRandomArbitrary(0, p.length)];
        for(var y = Math.min.apply(null, p); y <= ($scope.size.height - Math.min.apply(null, p)); y = +y + +yp){
          yp = p[getRandomArbitrary(0, p.length)];
          $scope.points.push({x: x, y: y});
        }}
    }

    function generateFillList (m) { //Generates a list of points to fill an area with a shape covering a 2d space.
      var i = 0;
      var m = $scope.mode;
      var r = $scope.radius.split(',');
      var radius = Math.max.apply(null, r);
      var mx = 0, my = 0;
      switch($scope.shape) {
        case '1':  mx=1; my=1; break;
        case '2':  if(m == '1'){mx=1; my=1;}else{mx=0.5; my=1;}break;
        case '3':  mx=.618; my=1; break;
        case '4':  mx=1;    my=1; break;
        case '5':  mx=1;    my=2; break;
        case '6':  mx=1;    my=1; break;
        case '7':  mx=.333; my=1; break;
        default :  mx=1;    my=1;
      }
      for(var x = 0; x < $scope.size.width + mx*radius; x = +x + mx * radius){
        for(var y = 0; y < $scope.size.height + my*radius; y = +y + my * radius){
          $scope.points.push({x: x, y: y});
        }
      }
    }

    function makeShape (x, y, c, r) {
      if($scope.angle >= 360){$scope.angle -= 360;}
      var poly;
      var a = $scope.angle;
      var id = $scope.shape;
      if($scope.shape == '7')
        {id = $scope.shapeList[Math.floor(Math.random()*($scope.shapeList.length-1))].value;}
      switch(id) {
        case '1':
          $scope.draw.circle(r).cx(x).cy(y).fill(c).transform({rotation: a, relative: false}); break;
        case '2':
          if(a==0)       {poly = [[x+.5*r,y+.5*r], [x,y-.5*r], [x-.5*r,y+.5*r]];}
          else if(a==180){poly = [[x-.5*r,y-.5*r], [x,y+.5*r], [x+.5*r,y-.5*r]];}
          else{poly = [[x-.5*r,y-.5*r], [x,y+.5*r], [x+.5*r,y-.5*r]];}
          $scope.draw.polygon(poly).fill(c).transform({rotation: a, relative: true}); break;
        case '3':
          $scope.draw.rect(.618*r, r).cx(x).cy(y).fill(c).transform({rotation: a, relative: true}); break;
        case '4':
          $scope.draw.line(x, y-2.427*r, x, y+2.42*r).
          stroke({ width: Math.max.apply(null, $scope.radius.split(','))/2 , color: c}).
            transform({rotation: a, relative: true});
          break;
        case '5':
          $scope.draw.ellipse().attr({cx: x, cy:y, rx: .5*r, ry: r}).fill(c).transform({rotation: a, relative: false}); break;
        case '6':
          poly = [[x+.5*r,y+.167*r], [x+.5*r,y-.167*r], [x+.167*r,y-.5*r], [x-.167*r,y-.5*r],
                  [x-.5*r,y-.167*r], [x-.5*r,y+.167*r], [x-.167*r,y+.5*r], [x+.167*r,y+.5*r]];
          $scope.draw.polygon(poly).fill(c).transform({rotation: a, relative: true});
          $scope.draw.rect(r, r).cx(x+r).cy(y+r).
            fill(colors[getRandomArbitrary(0, colors.length)]);
          break;
      }
    }

    function regenerateList(){
      if($scope.mode != $scope.prev_mode ||
         $scope.shape != $scope.prev_shape ||
         $scope.radius != $scope.prev_radius ||
         $scope.pitch != $scope.prev_pitch)
        { $scope.points = [];
          switch($scope.mode){
            case '1' : generatePointList(); break;
            case '2' : generatePointList(); break;
            case '3' : generatePointList(); break;
            case '4' : generatePointList(); break;
            case '5' : generatePointList(); break;
            case '6' : generatePointList(); break;
            case '7' : generateFillList();  break;
            case '8' : generateFillList();  break;
          }
        }
    }

    function savePrevious(){
      $scope.prev_mode = $scope.mode;
      $scope.prev_shape = $scope.shape;
      $scope.prev_radius = $scope.radius;
      $scope.prev_pitch = $scope.pitch;
    }

    function changeAngle(){
      switch($scope.shape) {
        case '1':  $scope.angle +=60; break;
        case '2':  $scope.angle = 0;$scope.angle +=180; break;
        case '3':  $scope.angle += 45; break;
        case '4':  $scope.angle += 30; break;
        case '5':  $scope.angle += 60; break;
        case '6':  $scope.angle += 60; break;
        case '7':  $scope.angle +=180; break;
        default: $scope.angle += 180;
      }
    }

    function getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    function init(){
      $scope.modeList = [
          { text: 'First', value: '1'},
          { text: 'Second', value: '2'},
          { text: 'Third', value: '3'},
          { text: 'Fourth', value: '4'},
          { text: 'Fifth', value: '5'},
          { text: 'Six', value: '6'},
          { text: 'Concentric', value: '7'},
          { text: 'Fill Frame', value: '8'}
        ];
      $scope.shapeList = [
          { text: 'Circle', value: '1'},
          { text: 'Triangle', value: '2'},
          { text: 'Rectangle', value: '3'},
          { text: 'Line', value: '4'},
          { text: 'Ellipse', value: '5'},
          { text: 'Octagon', value: '6'},
          { text: 'Random', value: '7'}
        ];
      $scope.rotList = [
          { text: 30,  value: '1'},
          { text: 45,  value: '2'},
          { text: 65,  value: '3'},
          { text: 60,  value: '4'},
          { text: 75,  value: '5'},
          { text: 90,  value: '6'},
          { text: 110, value: '7'},
          { text: 135, value: '8'}
        ];
      $scope.pitchList  = [
          { text: '32,42,46,54,60,64,70', value: '1'},
          { text: '20,22,24,28,30,34,44,54', value: '2'},
          { text: '20,22,28,30,32,65', value: '3'},
          { text: '20,30,32,40,60', value: '4'},
          { text: '10,15,25,37,40', value: '5'},
          { text: '15,19,26,39', value: '6'},
          { text: '1,2,3,4,5', value: '7'},
          { text: '20,28,32,36', value: '8'}
        ];
      $scope.radiusList  = [
          { text: '1,1,2,3,4,5,8,13,21,34', value: '1'},
          { text: '1,2,4,8,21,34', value: '2'},
          { text: '4,5,6,7,10,11,13,14,15', value: '3'},
          { text: '1,2,3,4,5,8,13,21', value: '4'},
          { text: '9,10,12,13,14,15', value: '5'},
          { text: '4,5,6,7,8,9,10', value: '6'},
          { text: '3,5,7,11,13,15', value: '7'},
          { text: '5,8,13,21,34', value: '8'},
          { text: '7,11,15,20', value: '9'},
          { text: '5,8,13,21', value: '10'},
          { text: '5,6,7,8,9', value: '11'},
          { text: '1,2,3,4,5', value: '12'}
        ];
      $scope.colorList = [
          { name: '#FFFF66,#FFCC00,#FF9900,#FF0000', value: '1', imageSrc: 'svg/1.svg' },
          { name: '#E8D0A9,#B7AFA3,#C1DAD6,#F5FAFA,#ACD1E9,#6D929B', value: '2', imageSrc: 'svg/2.svg' },
          { name: '#999967,#666666,#CCCCCC,#CCCC9A', value: '3', imageSrc: 'svg/3.svg' },
          { name: '#336699,#666666,#999999', value: '4', imageSrc: 'svg/4.svg' },
          { name: '#BED661,#89E894,#78D5E3,#7AF5F5,#34DDDD,#93E2D5', value: '5', imageSrc: 'svg/5.svg' },
          { name: '#FF3333,#999999,#669999,#003333', value: '6', imageSrc: 'svg/6.svg' },
          { name: '#153450,#294052,#447294,#8FBCDB,#F4D6BC,#F8E4CC', value: '7', imageSrc: 'svg/7.svg' },
          { name: '#B7C68B,#F4F0CB,#DED29E,#B3A580,#685642', value: '8', imageSrc: 'svg/8.svg' },
          { name: '#7EB5D6,#2A75A9,#274257,#DFC184,#8F6048,#644436', value: '9', imageSrc: 'svg/9.svg' },
          { name: '#6699CC,#003366,#C0C0C0,#000044', value: '10', imageSrc: 'svg/10.svg' },
          { name: '#CCCCCC,#000000,#FF6600', value: '11', imageSrc: 'svg/11.svg' },
          { name: '#129793,#505050,#FFF5C3,#9BD7D5,#FF7260', value: '12', imageSrc: 'svg/12.svg' },
          { name: '#6BCAE2,#51A5BA,#41924B,#AFEAAA,#87E293,#FE8402', value: '13', imageSrc: 'svg/13.svg' },
          { name: '#7D9C9F,#BDD8DA,#DFEFF0,#AD235E,#ECECEC,#B1B1B1', value: '14', imageSrc: 'svg/14.svg' },
          { name: '#003366,#CCCCCC,#FFCC00', value: '15', imageSrc: 'svg/15.svg' },
          { name: '#333333,#FFCC00,#669966,#993366', value: '16', imageSrc: 'svg/16.svg' },
          { name: '#74A6BD,#7195A3,#D4E7ED,#EB8540,#B06A3B,#AB988B', value: '17', imageSrc: 'svg/17.svg' },
          { name: '#A31E39,#485C5A,#8C9C9A,#9DB2B1,#BFCFCC,#D6E4E1', value: '18', imageSrc: 'svg/18.svg' },
          { name: '#1C263C,#313C53,#455268,#B6C0D2,#9CFF00,#FFFFFF', value: '19', imageSrc: 'svg/19.svg' },
          { name: '#006400,#B0C4DE,#0099CC,#CCFFFF', value: '20', imageSrc: 'svg/20.svg' },
          { name: '#154890,#6699FF,#CDBFAC,#E1D4C0,#F5EDE3,#FF6600', value: '21', imageSrc: 'svg/21.svg' },
          { name: '#000044,#555555,#444444,#333333', value: '22', imageSrc: 'svg/22.svg' },
          { name: '#D9CCB9,#DF7782,#E95D22,#017890,#613D2D', value: '23', imageSrc: 'svg/23.svg' },
          { name: '#FDB813,#F68B1F,#F17022,#62C2CC,#E4F6F8,#EEF66C', value: '24', imageSrc: 'svg/24.svg' },
          { name: '#561420,#821122,#C59A6F,#333333,#CCCCCC,#FCFCFC', value: '25', imageSrc: 'svg/25.svg' },
          { name: '#FDEDD0,#BCF1ED,#FF634D,#FD795B', value: '26', imageSrc: 'svg/26.svg' },
          { name: '#7C786A,#8DCDC1,#D3E397,#FFF5C3,#EB6E44', value: '27', imageSrc: 'svg/27.svg' },
          { name: '#CEEBFB,#A3D6F5,#66A7C5,#EE3233,#F0ECEB,#6C7476', value: '28', imageSrc: 'svg/28.svg' },
          { name: '#CE0000,#000063,#5A79A5,#9CAAC6,#DEE7EF', value: '29', imageSrc: 'svg/29.svg' },
          { name: '#020731,#3862C6,#6E7587,#806641,#AE956D', value: '30', imageSrc: 'svg/30.svg' },
          { name: '#EBC137,#E38C2D,#DB4C2C,#771E10,#48110C', value: '31', imageSrc: 'svg/31.svg' },
          { name: '#FF9900,#336688,#FFCC00', value: '32', imageSrc: 'svg/32.svg' },
          { name: '#00FF00,#004040,#D0CA9C,#000000', value: '33', imageSrc: 'svg/33.svg' },
          { name: '#2D3956,#455372,#616A7F,#E7E7E7,#E0E9E9,#FF1A00', value: '34', imageSrc: 'svg/34.svg' },
          { name: '#668E39,#96B566,#BCE27F,#7C7C7C,#C3C3C3,#F6FF97', value: '35', imageSrc: 'svg/35.svg' },
          { name: '#E96D63,#7FCA9F,#F4BA70,#85C1F5,#4A789C,#FCFEFD', value: '36', imageSrc: 'svg/36.svg' },
          { name: '#9C9284,#CCCC99,#E6E6CC,#6699CC,#FF9900,#000000', value: '37', imageSrc: 'svg/37.svg' },
          { name: '#9DAF72,#566047,#562F32,#462D44,#859731,#640E27', value: '38', imageSrc: 'svg/38.svg' },
          { name: '#CC6600,#6699CC,#99CCFF,#CAE5FF,#DCDCDC,#EEEEEE', value: '39', imageSrc: 'svg/39.svg' },
          { name: '#F1433F,#F7E967,#A9CF54,#70B7BA,#3D4C53', value: '40', imageSrc: 'svg/40.svg' },
          { name: '#004489,#E1E1D6,#D3D9DF,#989898,#565656,#DBDBCE', value: '41', imageSrc: 'svg/41.svg' },
          { name: '#02243C,#005DB3,#5195CE,#E6E6E6,#F9F9F9,#5BC236', value: '42', imageSrc: 'svg/42.svg' },
          { name: '#006666,#9DBCBC,#FFCC66,#FFEEBB,#6B6B6B,#B7B7B7', value: '43', imageSrc: 'svg/43.svg' },
          { name: '#2B3E42,#747E80,#D5E1DD,#F7F3E8,#F2583E,#77BED2', value: '44', imageSrc: 'svg/44.svg' },
          { name: '#054950,#789A9F,#EDF4F5,#FFFFFF,#F78F1E', value: '45', imageSrc: 'svg/45.svg' },
          { name: '#FF8F00,#5A8F29,#3C7DC4,#2B2B2B', value: '46', imageSrc: 'svg/46.svg' },
          { name: '#0A4958,#01B6AD,#F6E7D2,#FFFFFF', value: '47', imageSrc: 'svg/47.svg' }
        ];
        $scope.points = [];
        $scope.prev_mode = 1;
        $scope.prev_shape = 1;
        $scope.prev_radius = 1;
        $scope.prev_pitch = 1;
        $scope.angle = 45;
        $scope.radius = "5,8,13,21,34";
        $scope.pitch = "1,2,3,4";
        $scope.shape = 1;
        $scope.mode = 1;
        $scope.color = "#0A4958,#01B6AD,#F6E7D2,#FFFFFF";
        $scope.size = {'width': 750, 'height': 750};
        $scope.draw = SVG('drawing').size($scope.size.width, $scope.size.height).fill('#FFF');
    }
      $('#mode').ddslick({
        data:$scope.modeList,
        width:250,
        selecttext: "Mode",
        defaultSelectedIndex:1,
        onSelected: function(selectedData){
          $scope.mode = selectedData.selectedData.value;
        },
      });

      $('#color').ddslick({
        data:$scope.colorList,
        width:250,
        selecttext: "Colors",
        imagePosition:"left",
        defaultSelectedIndex:1,
        onSelected: function(selectedData){
          $scope.color = selectedData.selectedData.name;
          console.log(selectedData.selectedData.name);
        },
      });

      $('#initrot').ddslick({
        data:$scope.rotList,
        width:250,
        selecttext: "Initial Rotation",
        defaultSelectedIndex:1,
        onSelected: function(selectedData){
          $scope.angle = selectedData.selectedData.text;
        },
      });

      $('#shape').ddslick({
        data:$scope.shapeList,
        width:250,
        selecttext: "Shape",
        defaultSelectedIndex:1,
        onSelected: function(selectedData){
          $scope.shape = selectedData.selectedData.value;
        },
      });

      $('#radius').ddslick({
        data:$scope.radiusList,
        width:250,
        selecttext: "Radius",
        defaultSelectedIndex:1,
        onSelected: function(selectedData){
          $scope.radius = selectedData.selectedData.text;
        },
      });

      $('#pitch').ddslick({
        data:$scope.pitchList,
        width:250,
        selecttext: "Pitch",
        defaultSelectedIndex:1,
        onSelected: function(selectedData){
          $scope.pitch = selectedData.selectedData.text;
        },
      });

  });
