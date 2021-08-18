(function($) {

    App.GameStatePopup = function(willShow, didHide) {
      this.init(willShow, didHide);
    };
  
    jQuery.extend(
      App.GameStatePopup.prototype, {
  
        init: function(willShow, didHide) {
          var self = this;
          self.onReset = undefined;
          self.willShow = willShow;
          self.didHide = didHide;
          self.screen = $('#screen-menu');
          self.menu = $('#game-menu');
          self.element = $('#game-state-popup');

          $('#game-state-popup').click(function(){
            self.hide();
          });

          $('#game-state-popup-content').click(function(event){
            event.stopPropagation();
          });

          // https://stackoverflow.com/a/34046084
          $('#game-export-copy-to-clipboard').click(function(){
            var el = $('#game-export-state')[0];
            var oldContentEditable = el.contentEditable,
            oldReadOnly = el.readOnly,
            range = document.createRange();

            el.contentEditable = true;
            el.readOnly = false;
            range.selectNodeContents(el);

            var s = window.getSelection();
            s.removeAllRanges();
            s.addRange(range);

            el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

            el.contentEditable = oldContentEditable;
            el.readOnly = oldReadOnly;

            document.execCommand('copy');
          });

          $('#game-import-confirm').click(function(){
            var data = $('#game-import-state').val();
            if(data !== undefined && data !== ""){
              var game = gameboy.name;
              gameboy.name = 'temp';
              setValue('B64_SRAM_' + game, data);
              saveSRAM();
              if (self.onReset !== undefined) {
                self.onReset();
              }
            }
          });
        },

        loadGameState: function(){
          $('#game-export-state').val(saveState['B64_SRAM_' + gameboy.name]);
        },
  
        hide: function() {
          var self = this;
          setTimeout(function() {
            self.element.css('display', 'none');
            if (self.didHide !== undefined) {
              self.didHide();
            }
          }, 200);
        },
  
        show: function() {
          var self = this;
          if (self.willShow !== undefined) {
            self.willShow();
          }
          self.loadGameState();
          self.element.css('display', 'block');
        }
  
    });
  
  })(jQuery);
  