var app = $.sammy("#container2", function (){
    var gamect = 0;
    var _setup = false;

    function is_symmetric(game){
        return  (game['tl-r'] || 0) == (game['tl-c'] || 0) &&
                (game['tr-r'] || 0) == (game['bl-c'] || 0) &&
                (game['bl-r'] || 0) == (game['tr-c'] || 0) &&
                (game['br-r'] || 0) == (game['br-c'] || 0);
    }

    function identify_game(game){
        if (!is_symmetric(game)){
            return false;
        }

        var a = (game['tl-r'] || 0) - (game['bl-r'] || 0);
        var b = (game['br-r'] || 0) - (game['tr-r'] || 0);

        if (a > 0 && b > 0) {
            return 'sh';
        }
        else if (a > 0 && b < 0) {
            return 'pl';
        }
        else if (a < 0 && b > 0) {
            return 'pd';
        }
        else if (a < 0 && b < 0) {
            return 'hd';
        }
        else {
            return 'edge';
        }
    }

    function get_game_type(game){
        var type = identify_game(game);

        var game_type;
        if (type){
            game_type = "Symmetric";
            switch(type){
                case "hd":
                    game_type += ", Hawk-Dove";
                    break;
                case "pd":
                    game_type += ", Prisoner's Dilemma";
                    break;
                case "pl":
                    game_type += ", Prisoner's Delight";
                    break;
                case "sh":
                    game_type += ", Stag Hunt";
                    break;
                case "edge":
                    game_type += ", Edge Case";
                    break;
                default:
                    game_type += "";
            }
        }
        else {
            game_type = "Asymmetric";
        }

        return game_type;
    }

    function symmetric_input_binding(event){
        var data = event.data;
        var name = data.name;
        var form = $(data.form);
        var val = $(this).val();

        var target = name.substring(0, name.length - 1);
        if (target == "tr-"){
            target = "bl-";
        }
        else if (target == "bl-"){
            target = "tr-";
        }
        target += "c";

        $(".entry-input[name="+target+"]", form).val(val);
        $(".entry."+target).text(val || 0);
    }

    this.use(Sammy.Session);

    this.bind('run', function (){
        if (!_setup){
            this.session('games', function (){ return {}; });
            _setup = true;

            var games = this.session('games');

            var game;
            for (var key in games){
                game = games[key];
                this.trigger('loadgame', {key: key, add: false, game: game});
            }
        }
    });

    this.bind('loadgame', function (e, data){
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

        var tabindex = (gamect * 12);
        gamect++;
        
        var new_game = $("<div />").addClass('game').attr('id','game-'+key);
        new_game.hide();
        new_game.haml([
            ["%form"+(input ? ".editing" : ""), {action: "#/edit-game/"+key, method: "PUT", "accept-charset": "utf-8"},[
                ["%fieldset.wide-fields",[
                    [".game-actions",[
                        ["%button.button.positive.save-button",{"type": "submit", style: !input ? "display: none;" : "", tabindex: tabindex + 11},"Save Game"],
                        ["%a.button.positive.process-button",{href: "#/", style: input ? "display: none;" : ""}, "Process Game"],
                        ["%br"],
                        ["%a.button.edit-button",{href: "#/edit-game/"+key, style: input ? "display: none;" : ""},"Edit Game"],
                        ["%br.edit-button", {style: input ? "display: none;" : ""}],
                        ["%a.button.negative",{href: "#/delete-game/"+key, tabindex: tabindex + 12}, "Delete Game"]
                    ]],
                    [".game-grid",[
                        ["%a#/add-game/"+key, " "],
                        ["%a#/edit-game/"+key, " "],
                        ["%a#/view-game/"+key, " "],
                        ["%h1.label", {style: input ? "display: none;" : ""}, game.label],
                        ["%input.title",{type: "text", name: "label", placeholder: "Game Label", style: !input ? "display: none;" : "", tabindex: ++tabindex}],
                        ["%h2.game-type", {style: input ? "display: none;" : ""}, !input ? get_game_type(game) : ""],
                        ["%select.presets",{size: 1, name: "presets", style: !input ? "display: none;" : "", tabindex: ++tabindex},[
                            ["%option", {value: "f"}, "Free Entry"],
                            ["%optgroup", {label: "Symmetric Games"}, [
                                ["%option", {value: "s"}, "Free Symmetric Game"],
                                ["%option", {value: "sh"}, "Stag Hunt"],
                                ["%option", {value: "pd"}, "Prisoner's Dilemma"],
                                ["%option", {value: "hd"}, "Hawk-Dove"],
                                ["%option", {value: "pl"}, "Prisoner's Delight"]
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
            self.trigger('restrictgame', {form: $(this).parents("form").first(), presets: $(this)});
        });
        $("#games").append(new_game);
        new_game.slideDown();
    });

    this.bind('symbind', function (e, data){
        var form = data.form;
        this.log("symbind");

        $(".entry-input[name=tl-r]", form).bind('keyup.sym blur.sym', {name: 'tl-r', form: form}, symmetric_input_binding);
        $(".entry-input[name=tr-r]", form).bind('keyup.sym blur.sym', {name: 'tr-r', form: form}, symmetric_input_binding);
        $(".entry-input[name=bl-r]", form).bind('keyup.sym blur.sym', {name: 'bl-r', form: form}, symmetric_input_binding);
        $(".entry-input[name=br-r]", form).bind('keyup.sym blur.sym', {name: 'br-r', form: form}, symmetric_input_binding);
    });

    this.bind('symunbind', function (e, data){
        var form = data.form;

        $(".entry-input[name=tl-r]", form).unbind('keyup.sym blur.sym');
        $(".entry-input[name=tr-r]", form).unbind('keyup.sym blur.sym');
        $(".entry-input[name=bl-r]", form).unbind('keyup.sym blur.sym');
        $(".entry-input[name=br-r]", form).unbind('keyup.sym blur.sym');
    });

    this.bind('restrictgame', function (e, data){
        var presets = data.presets;
        var form = data.form;

        if (form.hasClass('editing')){
            var preset = presets.val();
            var game;
            switch(preset){
                case "f":
                    this.trigger('symunbind', {form: form});
                    this.trigger("rowentry", {form: form});
                    this.trigger("colentry", {form: form});
                    break;
                case "s":
                    this.trigger('symbind', {form: form});
                    this.trigger("rowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    break;
                case "pd":
                    game = {
                        'tl-r': 3,
                        'tr-r': 0,
                        'bl-r': 4,
                        'br-r': 1,
                        'tl-c': 3,
                        'tr-c': 4,
                        'bl-c': 0,
                        'br-c': 1
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    break;
                case "pl":
                    game = {
                        'tl-r': 4,
                        'tr-r': 1,
                        'bl-r': 3,
                        'br-r': 0,
                        'tl-c': 4,
                        'tr-c': 3,
                        'bl-c': 1,
                        'br-c': 0
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    break;
                case "sh":
                    game = {
                        'tl-r': 4,
                        'tr-r': 0,
                        'bl-r': 3,
                        'br-r': 2,
                        'tl-c': 4,
                        'tr-c': 3,
                        'bl-c': 0,
                        'br-c': 2
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    break;
                case "hd":
                    game = {
                        'tl-r': 3,
                        'tr-r': 2,
                        'bl-r': 4,
                        'br-r': 0,
                        'tl-c': 3,
                        'tr-c': 4,
                        'bl-c': 2,
                        'br-c': 0
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    break;
            }
        }
        
    });

    this.bind('rowentry', function (e, data){
        var form = data.form;
        var game = data.game;

        $(".entry.tl-r", form).hide();
        $(".entry.tr-r", form).hide();
        $(".entry.bl-r", form).hide();
        $(".entry.br-r", form).hide();
        $(".entry-input[name=tl-r]", form).val(game ? game['tl-r'] : $(".entry-input[name=tl-r]", form).val()).show();
        $(".entry-input[name=tr-r]", form).val(game ? game['tr-r'] : $(".entry-input[name=tr-r]", form).val()).show();
        $(".entry-input[name=bl-r]", form).val(game ? game['bl-r'] : $(".entry-input[name=bl-r]", form).val()).show();
        $(".entry-input[name=br-r]", form).val(game ? game['br-r'] : $(".entry-input[name=br-r]", form).val()).show();
    });

    this.bind('colentry', function (e, data){
        var form = data.form;
        var game = data.game;

        $(".entry.tl-c", form).hide();
        $(".entry.tr-c", form).hide();
        $(".entry.bl-c", form).hide();
        $(".entry.br-c", form).hide();
        $(".entry-input[name=tl-c]", form).val(game ? game['tl-c'] : $(".entry-input[name=tl-c]", form).val()).show();
        $(".entry-input[name=tr-c]", form).val(game ? game['tr-c'] : $(".entry-input[name=tr-c]", form).val()).show();
        $(".entry-input[name=bl-c]", form).val(game ? game['bl-c'] : $(".entry-input[name=bl-c]", form).val()).show();
        $(".entry-input[name=br-c]", form).val(game ? game['br-c'] : $(".entry-input[name=br-c]", form).val()).show();
    });

    this.bind('norowentry', function (e, data){
        var form = data.form;
        var game = data.game;

        $(".entry.tl-r", form).text((game ? game['tl-r'] : $(".entry-input[name=tl-r]", form).val()) || 0).show();
        $(".entry.tr-r", form).text((game ? game['tr-r'] : $(".entry-input[name=tr-r]", form).val()) || 0).show();
        $(".entry.bl-r", form).text((game ? game['bl-r'] : $(".entry-input[name=bl-r]", form).val()) || 0).show();
        $(".entry.br-r", form).text((game ? game['br-r'] : $(".entry-input[name=br-r]", form).val()) || 0).show();
        $(".entry-input[name=tl-r]", form).hide();
        $(".entry-input[name=tr-r]", form).hide();
        $(".entry-input[name=bl-r]", form).hide();
        $(".entry-input[name=br-r]", form).hide();
    });

    this.bind('nocolentry', function (e, data){
        var form = data.form;
        var game = data.game;

        $(".entry.tl-c", form).text((game ? game['tl-c'] : $(".entry-input[name=tl-c]", form).val()) || 0).show();
        $(".entry.tr-c", form).text((game ? game['tr-c'] : $(".entry-input[name=tr-c]", form).val()) || 0).show();
        $(".entry.bl-c", form).text((game ? game['bl-c'] : $(".entry-input[name=bl-c]", form).val()) || 0).show();
        $(".entry.br-c", form).text((game ? game['br-c'] : $(".entry-input[name=br-c]", form).val()) || 0).show();
        $(".entry-input[name=tl-c]", form).hide();
        $(".entry-input[name=tr-c]", form).hide();
        $(".entry-input[name=bl-c]", form).hide();
        $(".entry-input[name=br-c]", form).hide();
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
            form.addClass('editing');
            var self = this;
            form.slideUp(function (){
                $("input[name=label]", form).val(game.label).show();
                $("select.presets", form).show();
                $("h1.label", form).hide();
                $("h2.game-type", form).hide();
                $("button.save-button", form).show();
                $("a.process-button", form).hide();
                $("a.edit-button, br.edit-button", form).hide();
                self.trigger("rowentry", {game: game, form: form});
                self.trigger("colentry", {game: game, form: form});
                self.trigger("restrictgame", {form: form, presets: $("select.presets", form)});
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
        game.label = this.params.label || "Key: "+key;
        game['tl-r'] = parseInt(this.params['tl-r'] || 0);
        game['tl-c'] = parseInt(this.params['tl-c'] || 0);
        game['tr-r'] = parseInt(this.params['tr-r'] || 0);
        game['tr-c'] = parseInt(this.params['tr-c'] || 0);
        game['bl-r'] = parseInt(this.params['bl-r'] || 0);
        game['bl-c'] = parseInt(this.params['bl-c'] || 0);
        game['br-r'] = parseInt(this.params['br-r'] || 0);
        game['br-c'] = parseInt(this.params['br-c'] || 0);
        game['pics'] = {};

        games[key] = game;
        this.session('games', games);

        var game_type = get_game_type(game);

        var form = $(context.target);
        form.removeClass('editing');
        var self = this;
        form.slideUp(function (){
            $("input[name=label]", form).hide();
            $("select.presets", form).hide();
            $("h1.label", form).text(game.label).show();
            $("h2.game-type", form).text(game_type).show();
            $("button.save-button", form).hide();
            $("a.process-button", form).show();
            $("a.edit-button, br.edit-button", form).show();
            self.trigger("norowentry", {game: game, form: form});
            self.trigger("nocolentry", {game: game, form: form});
            form.slideDown(function (){
                self.redirect("#/view-game/"+key);
            });
        });

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