function System(){
    "use strict";
    var self = this;
    var isMoving = false;
    this.pathsOn = false;
    this.planets = [];
    this.followMode = false;
    var intervalId
    var paper = Raphael(0,0,4000,4000);

    this.clearAll = function(){
        ind('.planet').remove();
        document.querySelector('#instructions_container').style.display = "block";
        this.planets = [];
        paper.clear()
        this.stopMovement();
        window.scrollTo(2000-(window.innerWidth/2),2000-(window.innerHeight/2));
    }

    this.startMovement = function(){
        intervalId = setInterval(function(){
            if(self.followMode){	
                window.scrollTo($('.active').position().left-(window.innerWidth/2), $('.active').position().top-(window.innerHeight/2));
            }		
            movePlanets();
        }, 50);
    }

    function movePlanets(){
        var all_planets = self.planets;
        self.planets.forEach(function(curPlanet){
            var curPlanetObj = $(curPlanet.planetObj);
            var mass = curPlanet.mass
            var volume_this = $(this).width();
            self.planets.forEach(function(otherPlanet){
                if(otherPlanet != curPlanet){
                    var otherPlanetObj = $(otherPlanet.planetObj);
                    var volume_other = otherPlanetObj.width();
                    var delta_x = otherPlanetObj.position().left - curPlanetObj.position().left;
                    var delta_y = curPlanetObj.position().top - otherPlanetObj.position().top;
                    var r = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
                    var angle = Math.atan2(delta_x, delta_y);
                    var a = otherPlanet.mass/Math.pow(r, 2);
                    curPlanet.a_x = Math.sin(angle)*a;
                    curPlanet.a_y = Math.cos(angle)*a;

                    curPlanet.speed_x += curPlanet.a_x;
                    curPlanet.speed_y += curPlanet.a_y;
                }


            });
        });
        self.planets.forEach(function(curPlanet){
            var curPlanetObj = curPlanet.planetObj;
            var volume_this = curPlanetObj.width();
            var cur_x = curPlanetObj.position().left;
            var cur_y = curPlanetObj.position().top;
            var cur_x_move = curPlanet.speed_x;
            var cur_y_move = curPlanet.speed_y;
            var new_x = cur_x + cur_x_move;
            var new_y = cur_y - cur_y_move;
            curPlanetObj.css('left', new_x);
            curPlanetObj.css('top', new_y);
            if(new_x < -50 || new_x > 4100 || new_y < -50 || new_y > 4100){
                system.removePlanet(curPlanet);

            }

            if(self.pathsOn){

                draw_movement({x:cur_x, y:cur_y}, {x:cur_x + cur_x_move, y:cur_y-cur_y_move}, curPlanet);
            }
            self.planets.forEach(function(otherPlanet){
                if(otherPlanet != curPlanet){
                    var otherPlanetObj = otherPlanet.planetObj;
                    var volume_other = otherPlanetObj.width();
                    var delta_x = otherPlanetObj.position().left - curPlanetObj.position().left;
                    var delta_y = curPlanetObj.position().top - otherPlanetObj.position().top;
                    var r = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
                    var angle = Math.atan2(delta_x, delta_y);
                    if(r<=(volume_this+volume_other)/2){
                        curPlanet.collision = otherPlanet;
                        otherPlanet.collision = curPlanet;
                        merge_planets(curPlanet, otherPlanet)
                    } else {
                    }
                }
            });

        });
    }

    function draw_movement(from, to, planet){
        var cur_line = paper.path('M'+from.x+','+from.y+'Q'+Number((to.x-from.x)/2+from.x)+','+Number((to.y-from.y)/2+from.y)+','+to.x+','+to.y)
        cur_line.attr({'stroke': planet.color})

    }

    this.stopMovement = function(){
        clearInterval(intervalId)
    }

    function merge_planets(planet_a, planet_b){
        var planet_to_merge, planet_to_remove;
        if(getPlanetSpeed(planet_a)<getPlanetSpeed(planet_b)){
            planet_to_merge = planet_a;
            planet_to_remove = planet_b;
        } else {
            planet_to_merge = planet_b;
            planet_to_remove = planet_a;
        }
        planet_to_merge.speed_x += planet_to_remove.mass * planet_to_remove.speed_x/planet_to_merge.mass;
        planet_to_merge.speed_y += planet_to_remove.mass * planet_to_remove.speed_y/planet_to_merge.mass;
        planet_to_merge.mass += planet_to_remove.mass;
        self.removePlanet(planet_to_remove);
        return planet_to_merge
    }

    this.removePlanet = function(planetToRemove){
        var index = this.planets.indexOf(planetToRemove);
        this.planets.splice(index,1);
        if($(planetToRemove.planetElement).hasClass('active')){
            qs('#info_span').textContent = "";
        }
        planetToRemove.planetObj.remove();




    }

    function getPlanetSpeed(planet){
        return Math.sqrt(Math.pow(planet.speed_x, 2)+Math.pow(planet.speed_y,2))
    }

    this.buildSystem = function(planetsToAdd, options){
        this.pathsOn = data_path == 1 ? true : false;
        controller.setPath(this.pathsOn);
        this.clearPaper()        
    }

    this.clearPaper = function(){
        paper.clear()
    }

    this.populateSystemFromObject = function(planetsObject){
        var curPlanet, planetToAdd;
        for(var i=0;i<planetsObject.length;i++){

            curPlanet = planetsObject[i];
            planetToAdd = new Planet(planetsObject[i]);
            self.planets.push(planetToAdd);
            console.log(planetsObject[i].pos_x)

            $('#space').append(planetToAdd.planetObj);
            planetToAdd.planetObj.css({top: planetsObject[i].pos_y+'px', left: planetsObject[i].pos_x+'px'})

        }
        $('.planet').first().addClass('active');
        window.scrollTo($('.active').position().left-(window.innerWidth/2), $('.active').position().top-(window.innerHeight/2));

        controller.showPlanetInfo(self.planets[0]);

    }

}



