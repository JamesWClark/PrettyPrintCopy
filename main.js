$(document).ready(function() {
    
    var log = function(msg) {
        if(window.console && console.log) {
            console.log(msg);
        }        
    }
    
    var prettyPrintTabsToSpaces = true;
    
    var editor;
    var editorFontSize = 12;
    var editorTabSize = 4;
    
    editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;
    editor.setTheme("ace/theme/monokai");
    editor.setFontSize(editorFontSize);
    editor.session.setMode("ace/mode/java");
    editor.session.setUseSoftTabs(true);
    editor.session.setTabSize(editorTabSize);
    
    // stores a string of spaces equal to the size of `editorTabSize`
    var spaces = '';
    var setSpaces = function() {
        spaces = '';
        for(var i = 0; i < editorTabSize; i++) {
            spaces += ' ';
        }
    };
    
    // initial run
    setSpaces();
    
    // resize the editor to match window height
    var resizeEditor = function() {
        $('#editor').height($(window).height());
    };
    
    // copy text, undo/redo pretty print
    var prettify = function() {
        var editorText = '';
        if(prettyPrintTabsToSpaces) {
            editorText = editor.getValue().replace(/\t/g, spaces);
        } else {
            editorText = editor.getValue();
        }
        $('#pretty-code').text(editorText);
        $('#code-container').removeClass('prettyprinted');
        prettyPrint();
    }
    
    // sets the value of the tab size text box
    $('#set-tab-size').val(editorTabSize);
    
    // focus on text box click
    $('#set-tab-size').click(function() {
        $(this).select();
    });
    
    // on tab size changed
    $('#set-tab-size').change(function() {
        editorTabSize = $(this).val();
        editor.session.setTabSize(editorTabSize);
        setSpaces();
        prettify();
    });
    
    // checkbox clears or keeps background color in prettyprint
    $('#require-initial-background').change(function() {
        // i'm getting the opposite expected result here - not sure why so ! reverses it
        if(!this.checked) {
            $('#code-container, #pretty-code').removeClass('initial-background-required');
            prettify();
        } else {
            $('#code-container, #pretty-code').addClass('initial-background-required');
            prettify();
        }
    });
    
    $('#replace-tabs-with-spaces').change(function() {
        if(!this.checked) {
            prettyPrintTabsToSpaces = false;
        } else {
            prettyPrintTabsToSpaces = true;
        }
        prettify();
    });
    
    // select ACE theme
    $('#select-editor-theme').change(function() {
        editor.setTheme('ace/theme/' + this.value);
        resizeEditor();
    });
    
    // select PRETTIFY theme
    $('#select-pretty-theme').change(function() {
        $('#code-container').removeClass('prettyprinted');
        var href = $(this).val();
        $('.css-theme').attr('disabled', 'disabled');
        $('link[href="' + href + '"]').removeAttr('disabled');
        prettyPrint();
    });
    
    // select language - ACE and PRETTIFY
    $('#select-language').change(function() {
        editor.session.setMode('ace/mode/' + this.value);
        
        $("#pretty-code").removeClass(function (index, css) {
            // http://stackoverflow.com/a/5182103/1161948
            return (css.match (/(^|\s)language-\S+/g) || []).join(' ');
        });
        
        $("#pretty-code").addClass('lang-' + this.value);
    });

    // copy editor code to prettyprint
    editor.on('input', prettify);

    // resize editor when window changes
    $(window).resize(resizeEditor);
    
    // set initial editor size
    resizeEditor();
});
