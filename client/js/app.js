var _setup = false;

var app = $.sammy("#container2", function (){
    this.use("Session");
    this.use("Sammy.Haml");

    //var games = this.session('games', function (){ return {}; });
    
    this.bind('run', function (){
        if (!_setup){
            _setup = true;
            this.log("running!");
            $("#main").haml([
                ["#add-game-form", {style: "display: none;"}, [
                    ["%form", {action: "#/add-game", method: "PUT", "accept-charset": "utf-8"},[
                        ["%fieldset",[
                            ["%a#/add-game", " "],
                            ["%h1", "Add New Game"],
                            ["%input.text",{type: "text", name: "msg", placeholder: "Testing"}],
                            ["%br"],
                            ["%button.button.positive",{"type": "submit"},"Add Game"],
                            ["%a.button.negative",{href: "#/"}, "Cancel"]
                        ]]
                    ]]
                ]],
                ["%.actions", ["%a.button.add-game-link", {href: "#/add-game" }, "Add Game"]],
                ["#games"],
                ["%.actions", ["%a.button.add-game-link", {href: "#/add-game" }, "Add Game"]]
            ]);
        }
    });

    this.get("#/", function (){
        $("#add-game-form").slideUp();
    });

    this.get('#/add-game', function (){
        $("#add-game-form").slideDown();
    });

    this.put('#/add-game', function (context){
        var new_game = $("<div />");
        new_game.hide();
        new_game.append(this.params.msg);
        $("#games").prepend(new_game);
        new_game.slideDown();

        return false;
    });

    this.get('#/edit-game/:index', function (){

    });

});

$(function (){
   app.run("#/");
});