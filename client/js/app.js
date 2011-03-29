/**
 * The application object. This runs everything
 *
 */
var app = $.sammy("#container2", function (){
    var gamect = 0;
    var _setup = false;

    /**
     * Determines if the game is symmetric or not
     */
    function is_symmetric(game){
        return  (game['tl-r'] || 0) == (game['tl-c'] || 0) &&
                (game['tr-r'] || 0) == (game['bl-c'] || 0) &&
                (game['bl-r'] || 0) == (game['tr-c'] || 0) &&
                (game['br-r'] || 0) == (game['br-c'] || 0);
    }

    /**
     * Classifies the game
     *
     */
    function identify_game(game){
        if (!is_symmetric(game)){
            return is_battleofthesexes(game) || is_matchingpennies(game) || is_zerosum(game) || false;
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

    /**
     * Determines if the game is a Battle of the Sexes
     *
     */
    function is_battleofthesexes(game){
        var min = Math.min(game['tl-r'], game['tl-c'], game['tr-r'], game['tl-c'],
                game['bl-r'], game['bl-c'], game['br-r'], game['br-c']);

        var game2 = {};

        game2['tl-r'] = game['tl-r'] - min;
        game2['tr-r'] = game['tr-r'] - min;
        game2['bl-r'] = game['bl-r'] - min;
        game2['br-r'] = game['br-r'] - min;
        game2['tl-c'] = game['tl-c'] - min;
        game2['tr-c'] = game['tr-c'] - min;
        game2['bl-c'] = game['bl-c'] - min;
        game2['br-c'] = game['br-c'] - min;

        if (Math.min(game2['tr-r'], game2['tr-c'], game2['bl-r'], game2['bl-c']) == 0 &&
            Math.max(game2['tr-r'], game2['tr-c'], game2['bl-r'], game2['bl-c']) == 0 &&
            (game2['tl-r'] - game2['tl-c']) * (game2['br-r'] - game2['br-c']) < 0){
                return 'bos';
        }

        if (Math.min(game2['tl-r'], game2['tl-c'], game2['br-r'], game2['br-c']) == 0 &&
            Math.max(game2['tl-r'], game2['tl-c'], game2['br-r'], game2['br-c']) == 0 &&
            (game2['tr-r'] - game2['tr-c']) * (game2['bl-r'] - game2['bl-c']) < 0){
                return 'bos';
        }

        return false;
    }

    /**
     * Determines if the game is a Matching Pennies
     *
     */
    function is_matchingpennies(game){
        return  is_zerosum(game) &&
                (game['tl-r'] + game['tr-r'] == 0) &&
                (game['tl-r'] + game['bl-r'] == 0) &&
                (game['bl-r'] + game['br-r'] == 0) ? 'mp' : false;
    }

    /**
     * Determines if the game is zero-sum
     *
     */
    function is_zerosum(game){
        return  (game['tl-r'] + game['tl-c'] == 0) &&
                (game['tr-r'] + game['tr-c'] == 0) &&
                (game['bl-r'] + game['bl-c'] == 0) &&
                (game['br-r'] + game['br-c'] == 0) ? 'zsum' : false;
    }

    /**
     * Get the name of the type of the game
     *
     */
    function get_game_type(game){
        var type = identify_game(game);

        var game_type;
        
        switch(type){
            case "hd":
                game_type = "Symmetric, Hawk-Dove";
                break;
            case "pd":
                game_type = "Symmetric, Prisoner's Dilemma";
                break;
            case "pl":
                game_type = "Symmetric, Prisoner's Delight";
                break;
            case "sh":
                game_type = "Symmetric, Stag Hunt";
                break;
            case "edge":
                game_type = "Symmetric, Edge Case";
                break;
            case "mp":
                game_type = "Asymmetric, Matching Pennies";
                break;
            case "bos":
                game_type = "Asymmetric, Battle of the Sexes";
                break;
            case "zsum":
                game_type = "Asymmetric, Zero-Sum";
                break;
            default:
                game_type = "Asymmetric";
        }

        return game_type;
    }

    /**
     * Makes numbers appear correctly during symmetric entry
     *
     */
    function symmetric_input_binding(event){
        var data = event.data;
        var name = data.name;
        var form = $(data.form);
        var val = $(this).val();

        if (name){
            var target = name.substring(0, name.length - 1);
            if (target == "tr-"){
                target = "bl-";
            }
            else if (target == "bl-"){
                target = "tr-";
            }
            target += "c";

            $(".entry-input[name="+target+"]", form).val(val);
            $(".entry."+target, form).text(val || 0);
        } else {
            console.log("error");
        }
    }

    /**
     * Makes numbers appear correctly during zero-sum entry
     *
     */
    function zerosum_input_binding(event){
        var data = event.data;
        var name = data.name;
        var form = $(data.form);
        var val = $(this).val();

        if (name){
            var target = name.substring(0, name.length - 1);
            target += "c";

            $(".entry-input[name="+target+"]", form).val(val * -1);
            $(".entry."+target, form).text(val * -1 || 0);
        } else {
            console.log("error");
        }
    }

    /**
     * Includes
     *
     */
    this.use(Sammy.JSON);
    this.use(Sammy.Session);
    this.use(Sammy.GoogleAnalytics);

    /**
     * This is triggered when the application is started
     *
     */
    this.bind('run', function (){
        if (!_setup){
            _setup = true;
            this.session('games', function (){return {};});
            this.session('applet_count', function (){return 0;});
            var games = this.session('games');
            this.trigger('reloadgames', {games: games});

            this.trigger('permalinks');
        }
    });

    /**
     * Reloads the games displayed
     *
     */
    this.bind('reloadgames', function (e, data){
        $("#games").empty();
        var games = data.games;
        var games2 = [[]];

        $.each(games, function (index, game){
            game.key = index;
            if (game.sort){
                if (!games2[game.sort + 1]){
                    games2[game.sort + 1] = [];
                }

                games2[game.sort + 1].push(game);
            }
            else {
                games2[0].push(game);
            }
        });

        var nonsorted = games2.shift();
        games2.push(nonsorted);

        games = [];
        $.each(games2, function (index, gamelist){
            if (gamelist){
                $.each(gamelist, function (index2, game){
                    games.push(game);
                });
            }
        });

        var self = this;
        $.each(games, function (index, game){
            self.trigger('loadgame', {key: game.key, add: false, game: game});
        });
    });

    /**
     * Load a particular game
     */
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

        var tabindex = (gamect * 16);
        gamect++;
        
        var new_game = $("<div />").addClass('game').attr('id','game-'+key);
        $("#games").append(new_game);
        new_game.hide();
        new_game.haml(
            ["%form"+(input ? ".editing" : ""), {action: "#!/edit-game/"+key, method: "POST", "accept-charset": "utf-8"},[
                ["%fieldset.wide-fields",[
                    [".game-actions", [
                        ["%button.button.positive.save-button",{style: !input ? "display: none;" : "", tabindex: tabindex + 15},"save game"],
                        ["%a.button.positive.process-button",{href: "#!/process/"+key, style: input ? "display: none;" : ""}, "generate graphs"],
                        ["%br"],
                        ["%a.button.edit-button",{href: "#!/edit-game/"+key, style: input ? "display: none;" : ""},"edit game"],
                        ["%br.edit-button", {style: input ? "display: none;" : ""}],
                        ["%a.button.negative",{href: "#!/delete-game/"+key, tabindex: tabindex + 16}, "delete game"]
                    ]],
                    [".game-header", [
                        ["%a#!/add-game/"+key, " "],
                        ["%a#!/edit-game/"+key, " "],
                        ["%a#!/view-game/"+key, " "],
                        ["%a", {href: "#!/toggle-game/"+key}, [
                            ["%h1.label", {style: input ? "display: none;" : ""}, game.label]
                        ]]
                    ]],
                    [".game-grid",[
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
                            ]],
                            ["%optgroup", {label: "Asymmetric Games"}, [
                                ["%option", {value: "zsum"}, "Free Zero-sum Game"],
                                ["%option", {value: "mp"}, "Matching Pennies"],
                                ["%option", {value: "bos"}, "Battle of the Sexes"]
                            ]]
                        ]],
                        [".game-grid-actual", [
                            [".row.last", [
                                [".cell.header.horiz", ""],
                                [".cell.header.horiz", [
                                    ["%input.entry-input.header.center.text", {type: "text", name: "h1-c", placeholder: "Act 1", style: !input ? "display: none;" : "", tabindex: tabindex + 11}, game['h1-c'] || "C"],
                                    [".entry.header.center.h1-c", {style: input ? "display: none;" : ""}, game['h1-c'] || "C"]
                                ]],
                                [".cell.header.horiz", [
                                    ["%input.entry-input.header.center.text", {type: "text", name: "h2-c", placeholder: "Act 2", style: !input ? "display: none;" : "", tabindex: tabindex + 12}, game['h2-c'] || "D"],
                                    [".entry.header.center.h2-c", {style: input ? "display: none;" : ""}, game['h2-c'] || "D"]
                                ]]
                            ]],
                            [".row.last", [
                                [".cell.header", [
                                    [".row.last", [
                                        [".cell.header.vert", [
                                            ["%input.entry-input.header.text-right.text", {type: "text", name: "h1-r", placeholder: "Act 1", style: !input ? "display: none;" : "", tabindex: tabindex + 9}, game['h1-r'] || "C"],
                                            [".entry.header.text-right.h1-r", {style: input ? "display: none;" : ""}, game['h1-r'] || "C"]
                                        ]]
                                    ]],
                                    [".row.last", [
                                        [".cell.header.vert", [
                                            ["%input.entry-input.header.text-right.text", {type: "text", name: "h2-r", placeholder: "Act 2", style: !input ? "display: none;" : "", tabindex: tabindex + 10}, game['h2-r'] || "D"],
                                            [".entry.header.text-right.h2-r", {style: input ? "display: none;" : ""}, game['h2-r'] || "D"]
                                        ]]
                                    ]]
                                ]],
                                [".cell.double.last", [
                                    [".game-grid-actual-inner", [
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
                                                [".entry.left.tr-r", {style: input ? "display: none;" : ""}, game['tr-r'] || 0],
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
                        ]],
                        [".legend", [
                            ["%h4", "Graph Axes"],
                            ["%p", "The graph axes in each graph correspond directly to the upper/lower and \
                                        left/right strategies available to the Row Player and Column Player."],
                            ["%h4", "Top Left"],
                            ["%p", "This graph shows the Best Response Dynamics. \
                                        Row Player's best response curve is in red, and Column Player's is in blue."],
                            ["%h4", "Top Right"],
                            ["%p", "This graph shows solution trajectories of the discrete time replicator dynamics."],
                            ["%h4", "Bottom Left"],
                            ["%p", "This graph shows the continuous time replicator dynamics differential vector field."],
                            ["%h4", "Bottom Right"],
                            ["%p", "This graph shows solution trajectories of the continuous time replicator dynamics."],
                        ]]
                    ]]

                ]]
            ]]
        );

        var self = this;
        $("select.presets", new_game).bind('change', function (e, data){
            self.trigger('restrictgame', {form: $(this).parents("form").first(), presets: $(this)});
        });
        new_game.slideDown();
    });

    /**
     * Reload the permalinks
     */
    this.bind('permalinks', function (e, data){
        $(".actions .permalink").remove();
        var games = this.session('games') || {};

        var permalink = $("<a/>").text("permalink").attr("href","#!/load/"+this.json(games)).addClass('permalink').addClass('button');

        $(".actions").prepend(permalink);
    });

    /**
     * Bind the inputs for symmetric entry
     */
    this.bind('symbind', function (e, data){
        var form = data.form;

        $(".entry-input[name=tl-r]", form).bind('keyup.sym blur.sym focus.sym', {name: 'tl-r', form: form}, symmetric_input_binding);
        $(".entry-input[name=tr-r]", form).bind('keyup.sym blur.sym focus.sym', {name: 'tr-r', form: form}, symmetric_input_binding);
        $(".entry-input[name=bl-r]", form).bind('keyup.sym blur.sym focus.sym', {name: 'bl-r', form: form}, symmetric_input_binding);
        $(".entry-input[name=br-r]", form).bind('keyup.sym blur.sym focus.sym', {name: 'br-r', form: form}, symmetric_input_binding);

        $(".entry-input[name=br-r]", form).focus();
        $(".entry-input[name=bl-r]", form).focus();
        $(".entry-input[name=tr-r]", form).focus();
        $(".entry-input[name=tl-r]", form).focus();
    });

    /**
     * Unbind the inputs for symmetric entry
     *
     */
    this.bind('symunbind', function (e, data){
        var form = data.form;

        $(".entry-input[name=tl-r]", form).unbind('keyup.sym blur.sym focus.sym');
        $(".entry-input[name=tr-r]", form).unbind('keyup.sym blur.sym focus.sym');
        $(".entry-input[name=bl-r]", form).unbind('keyup.sym blur.sym focus.sym');
        $(".entry-input[name=br-r]", form).unbind('keyup.sym blur.sym focus.sym');
    });

    /**
     * Bind the inputs for zero-sum entry
     */
    this.bind('zsumbind', function (e, data){
        var form = data.form;

        $(".entry-input[name=tl-r]", form).bind('keyup.zsum blur.zsum focus.zsum', {name: 'tl-r', form: form}, zerosum_input_binding);
        $(".entry-input[name=tr-r]", form).bind('keyup.zsum blur.zsum focus.zsum', {name: 'tr-r', form: form}, zerosum_input_binding);
        $(".entry-input[name=bl-r]", form).bind('keyup.zsum blur.zsum focus.zsum', {name: 'bl-r', form: form}, zerosum_input_binding);
        $(".entry-input[name=br-r]", form).bind('keyup.zsum blur.zsum focus.zsum', {name: 'br-r', form: form}, zerosum_input_binding);

        $(".entry-input[name=br-r]", form).focus();
        $(".entry-input[name=bl-r]", form).focus();
        $(".entry-input[name=tr-r]", form).focus();
        $(".entry-input[name=tl-r]", form).focus();
    });

    /**
     * Unbind the inputs for symmetric entry
     *
     */
    this.bind('zsumunbind', function (e, data){
        var form = data.form;

        $(".entry-input[name=tl-r]", form).unbind('keyup.zsum blur.zsum focus.zsum');
        $(".entry-input[name=tr-r]", form).unbind('keyup.zsum blur.zsum focus.zsum');
        $(".entry-input[name=bl-r]", form).unbind('keyup.zsum blur.zsum focus.zsum');
        $(".entry-input[name=br-r]", form).unbind('keyup.zsum blur.zsum focus.zsum');
    });
//here
    /**
     * Restricts entry and/or loads preset games
     *
     */
    this.bind('restrictgame', function (e, data){
        var presets = data.presets;
        var form = data.form;

        if (form.hasClass('editing')){
            var preset = presets.val();
            var game;
            switch(preset){
                case "f":
                    this.trigger('symunbind', {form: form});
                    this.trigger('zsumunbind', {form: form});
                    this.trigger("rowentry", {form: form});
                    this.trigger("colentry", {form: form});
                    this.trigger("noautolabel", {form: form});
                    break;
                case "s":
                    this.trigger('zsumunbind', {form: form});
                    this.trigger('symbind', {form: form});
                    this.trigger("rowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    this.trigger("noautolabel", {form: form});
                    break;
                case "zsum":
                    this.trigger('symunbind', {form: form});
                    this.trigger('zsumbind', {form: form});
                    this.trigger("rowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    this.trigger("noautolabel", {form: form});
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
                        'br-c': 1,
                        'h1-c': 'C',
                        'h2-c': 'D',
                        'h1-r': 'C',
                        'h2-r': 'D'
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger('zsumunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    this.trigger("autolabel", {form: form, game: game});
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
                        'br-c': 0,
                        'h1-c': 'C',
                        'h2-c': 'D',
                        'h1-r': 'C',
                        'h2-r': 'D'
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger('zsumunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    this.trigger("autolabel", {form: form, game: game});
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
                        'br-c': 2,
                        'h1-c': 'S',
                        'h2-c': 'H',
                        'h1-r': 'S',
                        'h2-r': 'H'
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger('zsumunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    this.trigger("autolabel", {form: form, game: game});
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
                        'br-c': 0,
                        'h1-c': 'D',
                        'h2-c': 'H',
                        'h1-r': 'D',
                        'h2-r': 'H'
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger('zsumunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    this.trigger("autolabel", {form: form, game: game});
                    break;
                case "mp":
                    game = {
                        'tl-r': 1,
                        'tr-r': -1,
                        'bl-r': -1,
                        'br-r': 1,
                        'tl-c': -1,
                        'tr-c': 1,
                        'bl-c': 1,
                        'br-c': -1,
                        'h1-c': 'H',
                        'h2-c': 'T',
                        'h1-r': 'H',
                        'h2-r': 'T'
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger('zsumunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    this.trigger("autolabel", {form: form, game: game});
                    break;
                case "bos":
                    game = {
                        'tl-r': 3,
                        'tr-r': 0,
                        'bl-r': 0,
                        'br-r': 2,
                        'tl-c': 2,
                        'tr-c': 0,
                        'bl-c': 0,
                        'br-c': 3,
                        'h1-c': 'A',
                        'h2-c': 'B',
                        'h1-r': 'A',
                        'h2-r': 'B'
                    };
                    this.trigger('symunbind', {form: form});
                    this.trigger('zsumunbind', {form: form});
                    this.trigger("rowentry", {form: form, game: game});
                    this.trigger("colentry", {form: form, game: game});
                    this.trigger("norowentry", {form: form});
                    this.trigger("nocolentry", {form: form});
                    this.trigger("autolabel", {form: form, game: game});
                    break;
            }
        }
        
    });

    /**
     * Turns row player inputs on
     *
     */
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

    /**
     * Turns column player inputs on
     */
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

    /**
     * Turns row player inputs off
     */
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

    /**
     * Turns column player inputs off
     *
     */
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

    /**
     * Turns auto-labeling on
     *
     */
    this.bind('autolabel', function (e, data){
        var form = data.form;
        var game = data.game;

        $(".entry.h1-c", form).text((game ? game['h1-c'] : $(".entry-input[name=h1-c]", form).val()) || "C").show();
        $(".entry.h2-c", form).text((game ? game['h2-c'] : $(".entry-input[name=h2-c]", form).val()) || "D").show();
        $(".entry.h1-r", form).text((game ? game['h1-r'] : $(".entry-input[name=h1-r]", form).val()) || "C").show();
        $(".entry.h2-r", form).text((game ? game['h2-r'] : $(".entry-input[name=h2-r]", form).val()) || "D").show();
        $(".entry-input[name=h1-c]", form).val((game ? game['h1-c'] : $(".entry-input[name=h1-c]", form).val()) || "C").hide();
        $(".entry-input[name=h2-c]", form).val((game ? game['h2-c'] : $(".entry-input[name=h2-c]", form).val()) || "D").hide();
        $(".entry-input[name=h1-r]", form).val((game ? game['h1-r'] : $(".entry-input[name=h1-r]", form).val()) || "C").hide();
        $(".entry-input[name=h2-r]", form).val((game ? game['h2-r'] : $(".entry-input[name=h2-r]", form).val()) || "D").hide();
    });

    /**
     * Turns auto-labeling off
     *
     */
    this.bind('noautolabel', function (e, data){
        var form = data.form;
        var game = data.game;

        $(".entry.h1-c", form).hide();
        $(".entry.h2-c", form).hide();
        $(".entry.h1-r", form).hide();
        $(".entry.h2-r", form).hide();
        $(".entry-input[name=h1-c]", form).val((game ? game['h1-c'] : $(".entry-input[name=h1-c]", form).val())).show();
        $(".entry-input[name=h2-c]", form).val((game ? game['h2-c'] : $(".entry-input[name=h2-c]", form).val())).show();
        $(".entry-input[name=h1-r]", form).val((game ? game['h1-r'] : $(".entry-input[name=h1-r]", form).val())).show();
        $(".entry-input[name=h2-r]", form).val((game ? game['h2-r'] : $(".entry-input[name=h2-r]", form).val())).show();
    });

    /**
     * Update the game sorting order
     *
     */
    this.bind('updatesort', function (e, data){
        var order = data.order;
        var games = this.session('games');

        $.each(order, function (index, value){
            var key = value.substring(5);

            if (games[key]){
                games[key].sort = index;
            }
        });

        this.session('games', games);
        this.trigger('permalinks');
    });

    /**
     * Collapse the display of a game
     *
     */
    this.bind('mingame', function (e, data){
        var gamediv = data.gamediv;
        var force = data.force || "";

        var is_hidden = $(".game-actions:hidden", gamediv).length;
        if (is_hidden && force != "collapse"){
            $(".game-actions", gamediv).slideDown();
            $(".game-grid", gamediv).slideDown();
        }
        else if (!is_hidden && force != "expand") {
            $(".game-actions", gamediv).slideUp();
            $(".game-grid", gamediv).slideUp();
        }
    });

    /**
     * Default route. Doesn't do anything special
     */
    this.get("#!/", function (){
        $("#walkthrough").hide();
        $("#requirements").hide();
        $(".actions").show();
        $("#games").show();
        return false;
    });

    /**
     * Just a fix for a 404. Doesn't do anything either
     */
    this.get("#!/view-game/:key", function (){
        //todo - anything? (really a 404 fix)
    });

    /**
     * Collapses all games
     */
    this.get("#!/collapse-all", function (){
        var self = this;
        $(".game").each(function (index, div){
            self.trigger('mingame', {gamediv: $(div), force: "collapse"});
        });

        this.redirect("#!/")
    });

    /**
     * Expands all games
     *
     */
    this.get("#!/expand-all", function (){
        var self = this;
        $(".game").each(function (index, div){
            self.trigger('mingame', {gamediv: $(div), force: "expand"});
        });

        this.redirect("#!/")
    });

    /**
     * Collapse or expand a particular game
     */
    this.get("#!/toggle-game/:key", function (){
        var key = this.params.key;

        var gamediv = $("#game-"+key);
        this.trigger("mingame", {gamediv: gamediv});
        this.redirect("#!/");
    });

    /**
     * Delete all games
     */
    this.get("#!/clear", function (){
        if (confirm("Are you sure you want to delete all data?")){
            this.session('games', {});
            this.session('applet_count', 0);

            this.trigger('reloadgames', {games: {}});
            this.trigger('permalinks');
        }

        this.redirect("#!/");
    });

    /**
     * Add a new game
     *
     */
    this.get('#!/add-game', function (){
        var d = new Date();
        var key = hex_sha1(d.getTime() + ":" + d.getMilliseconds());
        this.redirect('#!/add-game/'+key);
    });

    /**
     * Actually do the work of adding a new game
     *
     */
    this.get("#!/add-game/:key", function (){
        var games = this.session('games');
        var key = this.params.key;

        if (games[key]){
            this.redirect("#!/edit-game/"+key);
        }
        else {
            this.trigger('loadgame', {key: key, add: true});
        }

        return false;
    });

    /**
     * Show the edit form for a game
     */
    this.get('#!/edit-game/:key', function (){
        var games = this.session('games');
        var key = this.params.key;

        if (games[key]){
            var game = games[key];

            var form = $("#game-"+key+" form");
            form.addClass('editing');
            var self = this;
            $(".game-grid .visualization", form).remove();
            $(".game-grid .legend", form).hide();
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
            this.redirect("#!/add-game/"+key);
        }
    });

    /**
     * Process the edit form for a game
     *
     */
    this.post('#!/edit-game/:key', function (context){
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
        game['h1-c'] = this.params['h1-c'] || "C";
        game['h2-c'] = this.params['h2-c'] || "D";
        game['h1-r'] = this.params['h1-r'] || "C";
        game['h2-r'] = this.params['h2-r'] || "D";

        this.log(this.params);
        this.log(game);

        games[key] = game;
        this.session('games', games);
        this.trigger('permalinks');

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
            self.trigger("autolabel", {game: game, form: form});
            form.slideDown(function (){
                self.redirect("#!/view-game/"+key);
            });
        });

        return false;
    });

    /**
     * Delete a particular game
     *
     */
    this.get("#!/delete-game/:key", function (){
        var games = this.session('games');
        var key = this.params.key;

        if (confirm("Are you sure you want to delete this game?")){
            if (games[key]){
                delete games[key];
                this.session('games', games);
                this.trigger('permalinks');
            }

            var self = this;
            $("#game-"+key).slideUp(function (){$("#game-"+key).remove();self.redirect("#!/");});
        }
        else {
            this.redirect("#!/");
        }
    });

    /**
     * Load a permalink
     *
     */
    this.get("#!/load/:games", function (){
        var games;
        try {
            games = this.json(decodeURI(this.params.games));
            if ($.isPlainObject(games) && confirm("This will remove all games you have loaded. Do you wish to continue?")){
                this.session('games', games);
                this.trigger('reloadgames', {games: games});
                this.trigger('permalinks');
            }
            else {
                this.log(games);
            }
        }
        catch(e){
            this.log(this.params.games);
            alert("Load data was not well formed.");
        }

        this.redirect("#!/");
    });

    /**
     * Display graphs for a game via loading a java applet
     *
     */
    this.get("#!/process/:key", function (){
        var games = this.session('games');
        var count = this.session('applet_count');
        var key = this.params.key;

        if (games[key]){
            var game = games[key];
            var hml = ["%object.visualization",  {width: "440", //648
                                            height: "440", //281
                                            code: "DynVizGraph",
                                            archive: "dynamics-visualization.jar",
                                            type: "application/x-java-applet",
                                            name: "game-applet-"+(++count),
                                            id: "game-applet-"+(count)}, [
                    ["%param", {name: "jnlp_href", value: "dynamics-visualization.jnlp"}],
                    ["%param", {name: "java_arguments", value: "-Djava.security.policy=applet.policy"}],
                    ["%param", {name: "boxborder", value: "false"}],
                    ["%param", {name: "A", value: game['tl-r']}],
                    ["%param", {name: "B", value: game['tl-c']}],
                    ["%param", {name: "C", value: game['tr-r']}],
                    ["%param", {name: "D", value: game['tr-c']}],
                    ["%param", {name: "E", value: game['bl-r']}],
                    ["%param", {name: "F", value: game['bl-c']}],
                    ["%param", {name: "G", value: game['br-r']}],
                    ["%param", {name: "H", value: game['br-c']}],
                    ["%param", {name: "CL1", value: game['h1-c']}],
                    ["%param", {name: "CL2", value: game['h2-c']}],
                    ["%param", {name: "RL1", value: game['h1-r']}],
                    ["%param", {name: "RL2", value: game['h2-r']}],
                ]];

            if ($.browser.msie){
                hml[0] = "%applet.visualization";
            }

            $("#game-"+key+" .game-grid .visualization").remove();
            $("#game-"+key+" .game-grid .legend").show();
            $("#game-"+key+" .game-grid").haml(hml);

            this.session('applet_count', count);
        }

        this.redirect("#!/");
    });

    /**
     * Shows the system requirements
     *
     */
    this.get("#!/requirements", function (){
       $(".actions").hide();
       $("#games").hide();
       $("#walkthrough").hide();
       $("#requirements").show();
    });
    
    /**
     * Shows the walkthrough
     *
     */
    this.get("#!/walkthrough", function (){
       this.redirect("#!/walkthrough/step0");
    });

    this.get("#!/walkthrough/:step", function(){
        $(".actions").hide();
        $("#games").hide();
        $("#requirements").hide();
        $("#walkthrough").show();

        var step = this.params.step;

        if (!step){
            step = "step0";
        }

        if ($("#walkthrough ."+step).length || step == "step0"){
            $("#walkthrough .step").hide();
            $("#walkthrough ."+step).show();
        }
        else {
            this.redirect("#!/walkthrough/step0");
        }
    });

});

/**
 * $(document).ready() shorthand. Makes game list sortable and sets everything in motion.
 *
 */
$(function (){
    $("#games").sortable({
       distance: 25,
       forcePlaceholderSize: true,
       items: '.game',
       placeholder: 'info',
       update: function (e, ui){
           app.trigger("updatesort", {order: $("#games").sortable("toArray")});
       }
    });

    $("a.lightbox").lightBox({fixedNavigation: true});

    $("#walkthrough,#requirements").hide();

    app.run("#!/");
});
