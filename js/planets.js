function Planet(options) {
	this.volume = options.volume;
	this.mass = options.mass;
	this.speed = options.speed;
	this.direction = options.direction;
	this.name = options.name;
	this.acc = options.acc;
	this.a_x = 0;
	this.a_y = 0;
	this.collision={};
	this.color = options.color;
	this.planetObj = $("<div id='"+name+"' class='planet' data-direction='"+this.direction+"' data-speed='"+this.speed+"' data-mass='"+this.mass+"' data-acc='"+this.acc+"' style='width:"+this.volume+"px; height: "+this.volume+"px; margin-left: "+(-this.volume/2)+"px; margin-top: "+(-this.volume/2)+"px; background: linear-gradient(to bottom right, #555,"+ this.color+")'></div>");

	var direction_rad = this.direction * (Math.PI / 180);
	this.speed_x = Math.sin(direction_rad) * this.speed;
	this.speed_y = Math.cos(direction_rad) * this.speed;


}	

