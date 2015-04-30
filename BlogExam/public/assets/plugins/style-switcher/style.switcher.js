var styleSwitcher = {
    initialized: false,
    options: {
        color: 'light'
    },
    initialize: function() {
        var $this = this;
        if (this.initialized)
            return;

        $("head").append($('<link rel="stylesheet">').attr("href", "assets/plugins/style-switcher/style-switcher.css"));
        $this.build();
        $this.events();
        if ($.cookie("skin") != null) {
            $this.setColor($.cookie("skin"))
        } else {
            $this.container.find("ul[data-type=colors] li:first a").click()
        }
        if ($.cookie("initialized") == null) {
            $this.container.find("h4 a").click();
            $.cookie("initialized", true)
        }
        $this.initialized = true
    },
    build: function() {
        var $this = this;
        var switcher = $("<div />").attr("id", "styleSwitcher").addClass("style-switcher visible-lg").append($("<h4 />").html("Color Scheme").append($("<a />").attr("href", "#").append($("<i />").addClass("fa fa-cog"))), $("<div />").addClass("style-switcher-wrap").append($("<h5 />").html("Select"), $("<ul />").addClass("options colors").attr("data-type", "colors")));
        $("body").append(switcher);
        this.container = $("#styleSwitcher");
        var colors = [{
            "Hex": "#FFFFFF",
            "colorName": "light"
        }, {
            "Hex": "#272A31",
            "colorName": "dark"
        }
        ];
        var colorList = this.container.find("ul[data-type=colors]");
        $.each(colors, function(i, value) {
            var color = $("<li />").append($("<a />").css("background-color", colors[i].Hex).attr({
                "data-color-hex": colors[i].Hex,
                "data-color-name": colors[i].colorName,
                "href": "#",
                "title": colors[i].colorName
            }).html(colors[i].colorName));
            colorList.append(color)
        });
        if ($.cookie("skin") != null) {
            var currentSkinColor = $.cookie("skin")
        } else {
            var currentSkinColor = colors[0].colorName
        }
        colorList.find("a").click(function(e) {
            e.preventDefault();
            $this.setColor($(this).attr("data-color-name"))
        });
        $this.container.find("a.reset").click(function(e) {
            e.preventDefault();
            $this.reset()
        });
    },
    events: function() {
        var $this = this;
        $this.container.find("h4 a").click(function(e) {
            e.preventDefault();
            if ($this.container.hasClass("active")) {
                $this.container.animate({
                    right: "-" + $this.container.width() + "px"
                }, 300).removeClass("active")
            } else {
                $this.container.animate({
                    right: "0"
                }, 300).addClass("active")
            }
        });
        if ($.cookie("showSwitcher") != null) {
            $this.container.find("h4 a").click();
            $.removeCookie("showSwitcher")
        }
    },
    setColor: function(color) {
        var $this = this;
        var $colorSwitcherLink = jQuery('#css-switcher-link');
        if (this.isChanging) {
            return false
        }
        $colorSwitcherLink.attr('href', 'assets/css/theme-' + color + '.css');
        $.cookie("skin", color);
        if (color == this.container.find("ul[data-type=colors] li:first a").attr("data-color-name")) {
            $('#partners img, div.logo img').each(function () {
                arr = $(this).attr('src').split('/');
                $(this).attr('src', 'assets/img/light/' + arr[arr.length - 1]);
            });
        } else {
            $('#partners img, div.logo img').each(function () {
                arr = $(this).attr('src').split('/');
                $(this).attr('src', 'assets/img/' + color + '/' + arr[arr.length - 1]);
            });
        }
    },
    reset: function() {
        $.removeCookie("skin");
        $.cookie("showSwitcher", true);
        window.location.reload()
    }
};
styleSwitcher.initialize();
