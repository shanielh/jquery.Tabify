$(function() {
   
    $.fn.tabify = function() {
        
        var tabText = '    ';
        
        // Gets the most close line start to the given offset.
        var getMostCloseLineStart = function(text, offset, coefficient) {
            
            var i;
            for (i = offset; i > 0 && i < text.length; i += coefficient) {
                if (text[i] == '\n' || text[i] == '\r') {
                    return i;
                }
            }
            return i;
        }
        
        var removeFromStart = function(text, subtext) {
            
            if (text.length >= subtext.length &&
                text.substring(0, subtext.length) == subtext) {
                
                    return text.substring(subtext.length);
            }
            
            return text;
        }
        
        // Adds tab when needed.
        var onKeyDown = function(e) {
            
            var target = e.target;
            
            // Escape
            if (e.keyCode == 27) {
                var parentSpan = $(target).parent('span');
                parentSpan.attr('tabIndex', 0);
                parentSpan.focus();
                parentSpan.attr('tabIndex', null);
                e.preventDefault();
            }
            
            // Tab
            if (e.keyCode == 9) {
                
                // Prevent default behavior
                e.preventDefault();
                
                var selectionStart = target.selectionStart;
                var selectionEnd = target.selectionEnd;
                
                if (selectionStart == selectionEnd) {
                    // add tab
                    var beforeValue = target.value.substring(0, selectionStart);
                    var afterValue = target.value.substring(selectionEnd);
                
                    target.value = beforeValue + tabText + afterValue;
                    target.selectionStart = target.selectionEnd = selectionStart + tabText.length;
                    
                    return;
                } 
                
                selectionStart = getMostCloseLineStart(target.value, selectionStart, -1);
                selectionEnd = getMostCloseLineStart(target.value, selectionEnd, 1);
                
                // Add tab to all selected rows.
                var beforeValue = target.value.substring(0, selectionStart);
                var afterValue = target.value.substring(selectionEnd);
                var selectedValue = target.value.substring(selectionStart, selectionEnd);
                
                var isShift = e.shiftKey;
                var lines = selectedValue.split(/\r\n|\n\r|\r|\n/g);
                
                if (isShift) {
                    for (index in lines) {
                        lines[index] = removeFromStart(lines[index], tabText);
                    }
                } else {
                    for (index in lines) {
                        lines[index] = tabText + lines[index];
                    }
                }
                target.value = beforeValue + lines.join('\n') + afterValue;
                
            }
            
        };
        
        var onSpanKeyDown = function(e) {
            
            var target = e.target;
            
            // When pressing tab, move the focus to the inner textarea.
            if (e.keyCode == 9) {
                $(target).find('textarea').focus();
                return;
            }
            
        }
   
        $(this).find("textarea[data-tabify]").each(function(index, item) {
       
            var target = $(item);
            var wrapSpan = $('<span />');
            
            wrapSpan.keydown(onSpanKeyDown);
            
            target.wrap(wrapSpan);
        
            target.keydown(onKeyDown);
        
        });
        
    }
    
    $("body").tabify();
   
    
});