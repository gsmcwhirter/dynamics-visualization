var _setup = false;

var app = $.sammy("#container2", function (){
    this.use(Sammy.Session);

    this.bind('run', function (){
        if (!_setup){
            this.session('games', function (){ return {}; });
            this.log(this.session('games'));
            _setup = true;
            this.log("running!");

            var games = this.session('games');

            var game;
            for (var key in games){
                this.log("appending game "+key);
                game = games[key];
                this.trigger('loadgame', {key: key, add: false, game: game});
            }
        }
    });

    this.bind('loadgame', function (e, data){
        this.log('adding game event');
        var key = data.key;

        var input;
        var game = {};
        if (data.add){
            input = true;
        }
        else {
            input = false;
            game = data.game;
        }

        var tabindex = 0;
        var new_game = $("<div />").addClass('game').attr('id','game-'+key);
        new_game.hide();
        new_game.haml([
            ["%form"+(input ? ".editing" : ""), {action: "#/edit-game/"+key, method: "PUT", "accept-charset": "utf-8"},[
                ["%fieldset.wide-fields",[
                    [".game-actions",[
                        ["%button.button.positive.save-button",{"type": "submit", style: !input ? "display: none;" : ""},"Save Game"],
                        ["%a.button.positive.process-button",{href: "#/", style: input ? "display: none;" : ""}, "Process Game"],
                        ["%br"],
                        ["%a.button.edit-button",{href: "#/edit-game/"+key, style: input ? "display: none;" : ""},"Edit Game"],
                        ["%br.edit-button", {style: input ? "display: none;" : ""}],
                        ["%a.button.negative",{href: "#/delete-game/"+key}, "Delete Game"]
                    ]],
                    [".game-grid",[
                        ["%a#/add-game/"+key, " "],
                        ["%a#/edit-game/"+key, " "],
                        ["%a#/view-game/"+key, " "],
                        ["%h1.label", {style: input ? "display: none;" : ""}, game.label],
                        ["%input.title",{type: "text", name: "label", placeholder: "Game Label", style: !input ? "display: none;" : "", tabindex: ++tabindex}],
                        ["%select.presets",{size: 1, name: "presets", style: !input ? "display: none;" : "", tabindex: ++tabindex},[
                            ["%option", {value: "f"}, "Free Entry"],
                            ["%optgroup", {label: "Symmetric Games"}, [
                                ["%option", {value: "s"}, "Free Symmetric Game"],
                                ["%option", {value: "sh"}, "Stag Hunt"],
                                ["%option", {value: "pd"}, "Prisoner's Dilemma"],
                                ["%option", {value: "hd"}, "Hawk-Dove"],
                                ["%option", {value: "sh"}, "Prisoner's Delight"]
                            ]]
                        ]],
                        [".game-grid-actual", [
                            [".row", [
                                [".cell", [
                                    ["%input.entry-input.right.text", {type: "text", name: "tl-c", placeholder: "Col TL", style: !input ? "display: none;" : "", tabindex: ++tabindex + 1}],
                                    [".entry.right.tl-c", {style: input ? "display: none;" : ""}, game['tl-c'] || 0],
                                    ["%input.entry-input.left.text", {type: "text", name: "tl-r", placeholder: "Row TL", style: !input ? "display: none;" : "", tabindex: ++tabindex - 1}],
                                    [".entry.left.tl-r", {style: input ? "display: none;" : ""}, game['tl-r'] || 0],
                                    ["%span.sep", ","]
                                ]],
                                [".cell.last", [
                                    ["%input.entry-input.right.text", {type: "text", name: "tr-c", placeholder: "Col TR", style: !input ? "display: none;" : "", tabindex: ++tabindex + 1}],
                                    [".entry.right.tr-c", {style: input ? "display: none;" : ""}, game['tr-c'] || 0],
                                    ["%input.entry-input.left.text", {type: "text", name: "tr-r", placeholder: "Row TR", style: !input ? "display: none;" : "", tabindex: ++tabindex - 1}],
                                    [".entry.left.tr-r", {style: input ? "display: none;" : ""}, game['tl-r'] || 0],
                                    ["%span.sep", ","]
                                ]]
                            ]],
                            [".row.last", [
                                [".cell", [
                                    ["%input.entry-input.right.text", {type: "text", name: "bl-c", placeholder: "Col BL", style: !input ? "display: none;" : "", tabindex: ++tabindex + 1}],
                                    [".entry.right.bl-c", {style: input ? "display: none;" : ""}, game['bl-c'] || 0],
                                    ["%input.entry-input.left.text", {type: "text", name: "bl-r", placeholder: "Row BL", style: !input ? "display: none;" : "", tabindex: ++tabindex - 1}],
                                    [".entry.left.bl-r", {style: input ? "display: none;" : ""}, game['bl-r'] || 0],
                                    ["%span.sep", ","]
                                ]],
                                [".cell.last", [
                                    ["%input.entry-input.right.text", {type: "text", name: "br-c", placeholder: "Col BR", style: !input ? "display: none;" : "", tabindex: ++tabindex + 1}],
                                    [".entry.right.br-c", {style: input ? "display: none;" : ""}, game['br-c'] || 0],
                                    ["%input.entry-input.left.text", {type: "text", name: "br-r", placeholder: "Row BR", style: !input ? "display: none;" : "", tabindex: ++tabindex - 1}],
                                    [".entry.left.br-r", {style: input ? "display: none;" : ""}, game['br-r'] || 0],
                                    ["%span.sep", ","]
                                ]]
                            ]]
                        ]]
                    ]]

                ]]
            ]]
        ]);

        var self = this;
        $("select.presets", new_game).bind('change', function (e, data){
            self.trigger('restrictgame', {key: key, to: $(this).val()});
        });
        $("#games").append(new_game);
        new_game.slideDown();
    });

    this.bind('restrictgame', function (e, data){

    });

    this.get("#/", function (){
        //todo - directions or something?
    });

    this.get('#/add-game', function (){
        var d = new Date();
        var key = hex_sha1(d.getTime() + ":" + d.getMilliseconds());
        this.redirect('#/add-game/'+key);
    });

    this.get("#/add-game/:key", function (){
        var games = this.session('games');
        var key = this.params.key;

        if (games[key]){
            this.redirect("#/edit-game/"+key);
        }
        else {
            this.log("appending new game");
            this.trigger('loadgame', {key: key, add: true});
        }

        return false;
    });

    this.get('#/edit-game/:key', function (context){
        var games = this.session('games');
        var key = this.params.key;

        if (games[key]){
            var game = games[key];

            var form = $("#game-"+key+" form");
            form.slideUp(function (){
                $(".entry", form).hide();
                $("input[name=label]", form).val(game.label).show();
                $("select.presets", form).show();
                $("h1.label", form).hide();
                $("button.save-button", form).show();
                $("a.process-button", form).hide();
                $("a.edit-button, br.edit-button", form).hide();
                $(".entry-input[name=tl-c]", form).val(game['tl-c']).show();
                $(".entry-input[name=tl-r]", form).val(game['tl-r']).show();
                $(".entry-input[name=tr-c]", form).val(game['tr-c']).show();
                $(".entry-input[name=tr-r]", form).val(game['tr-r']).show();
                $(".entry-input[name=bl-c]", form).val(game['bl-c']).show();
                $(".entry-input[name=bl-r]", form).val(game['bl-r']).show();
                $(".entry-input[name=br-c]", form).val(game['br-c']).show();
                $(".entry-input[name=br-r]", form).val(game['br-r']).show();
                form.slideDown();
            });

        }
        else {
            this.redirect("#/add-game/"+key);
        }
    });

    this.put('#/edit-game/:key', function (context){
        var games = this.session('games');
        var key = this.params.key;
        
        var game = {};
        game.label = this.params.label || key;
        game['tl-r'] = this.params['tl-r'] || 0;
        game['tl-c'] = this.params['tl-c'] || 0;
        game['tr-r'] = this.params['tr-r'] || 0;
        game['tr-c'] = this.params['tr-c'] || 0;
        game['bl-r'] = this.params['bl-r'] || 0;
        game['bl-c'] = this.params['bl-c'] || 0;
        game['br-r'] = this.params['br-r'] || 0;
        game['br-c'] = this.params['br-c'] || 0;
        game['pics'] = {};

        games[key] = game;
        this.session('games', games);
        this.log(this.session('games'));

        var form = $(context.target);
        this.log(form);
        form.slideUp(function (){
            $("input.entry-input", form).hide();
            $("input[name=label]", form).hide();
            $("select.presets", form).hide();
            $("h1.label", form).text(game.label).show();
            $("button.save-button", form).hide();
            $("a.process-button", form).show();
            $("a.edit-button, br.edit-button", form).show();
            $(".entry.tl-c", form).text(game['tl-c']).show();
            $(".entry.tl-r", form).text(game['tl-r']).show();
            $(".entry.tr-c", form).text(game['tr-c']).show();
            $(".entry.tr-r", form).text(game['tr-r']).show();
            $(".entry.bl-c", form).text(game['bl-c']).show();
            $(".entry.bl-r", form).text(game['bl-r']).show();
            $(".entry.br-c", form).text(game['br-c']).show();
            $(".entry.br-r", form).text(game['br-r']).show();
            form.slideDown();
        });

        this.redirect("#/view-game/"+key);

        return false;
    });

    this.get("#/delete-game/:key", function (){
        var games = this.session('games');
        var key = this.params.key;

        if (confirm("Are you sure you want to delete this game?")){
            if (games[key]){
                delete games[key];
                this.session('games', games);
            }

            var self = this;
            $("#game-"+key).slideUp(function (){ $("#game-"+key).remove(); self.redirect("#/"); });
        }
        else {
            this.redirect("#/");
        }
    });

});

$(function (){
   app.run("#/");
});