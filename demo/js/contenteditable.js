window.onload = function () {
    "use strict";

    var undoManager,
        circleDrawer,
        btnUndo,
        btnRedo,
        btnClear;

    undoManager = new UndoManager();

    function changeText(before, after, textelement) {
        undoManager.add({
            undo: function () {
                $(textelement).html(before);
            },
            redo: function () {
                $(textelement).html(after);
            }
        });
    }
    
    var text = $("#content"),
            startValue = text.html(),
            timer;
    $("#content").bind("keyup", function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            var newValue = text.html();
            if (newValue != startValue) {
                changeText(startValue, newValue, text);
                startValue = newValue;
            }
        }, 250);
    });


    btnUndo = document.getElementById('btnUndo');
    btnRedo = document.getElementById('btnRedo');
    btnBold = document.getElementById('btnBold');
    btnItalic = document.getElementById('btnItalic');
    btnClear = document.getElementById('btnClear');

    function updateUI() {
        btnUndo.disabled = !undoManager.hasUndo();
        btnRedo.disabled = !undoManager.hasRedo();
    }
    undoManager.setCallback(updateUI);

    btnUndo.onclick = function () {
        undoManager.undo();
        updateUI();
    };
    btnRedo.onclick = function () {
        undoManager.redo();
        updateUI();
    };
    btnBold.onclick = function () {
        var text = $("#content"), 
            startValue = text.html();
        document.execCommand("bold", false);
        var newValue = text.html();
        changeText(startValue, newValue, text);
        updateUI();
    };
    btnItalic.onclick = function () {
        var text = $("#content"), 
            startValue = text.html();
        document.execCommand("italic", false);
        var newValue = text.html();
        changeText(startValue, newValue, text);
        updateUI();
    };
    btnClear.onclick = function () {
        undoManager.clear();
        updateUI();
    };

    updateUI();
};