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
    btnClear.onclick = function () {
        undoManager.clear();
        updateUI();
    };

    updateUI();
};