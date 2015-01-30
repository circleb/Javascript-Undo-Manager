var undoManager,
    startValue,
    btnUndo,
    btnRedo,
    btnClear,
    timer,
    discussions = [];

$(function() {
    text = document.getElementById('content');
    window.tracker = new ice.InlineChangeEditor({
        element: text,
        handleEvents: true,
        currentUser: {
            id: 11,
            name: 'Blair Adams'
        },
        plugins: ['IceAddTitlePlugin', 'IceSmartQuotesPlugin',
            'IceEmdashPlugin', {
                name: 'IceCopyPastePlugin',
                settings: {
                    pasteType: 'formattedClean',
                    preserve: 'p,a[href],i,em,b,span,ul,ol,li,hr'
                }
            }
        ]
    }).startTracking();
}); 

function getStartValue() {
    text = $("#content");
    startValue = $(text).html();
}

function formatBlockToUndoStack(element) {
    getStartValue();
    document.execCommand('formatBlock', null, '<'+element+'>');
    var newValue = $("#content").html(); 
    changeText(text, startValue, newValue);
}

function formatInlineToUndoStack(type) {
    getStartValue();
    document.execCommand(type, false);
    var newValue = $("#content").html();
    changeText(startValue, newValue, text);
};

function iceToUndoStack(iceFunc) {
    getStartValue();
    tracker[iceFunc]();
    var newValue = $("#content").html();
    changeText(startValue, newValue, text);
}

function undoStack(undoFunc) {
    undoManager[undoFunc]();
}

getStartValue();

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

$("#content").bind("keydown", function() {
    getStartValue();
 });

$("#content").bind("keyup", function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
        var newValue = $(text).html();
        if (newValue != startValue) {
            changeText(startValue, newValue, text);
        }
    }, 250);
});


btnUndo = document.getElementById('btnUndo');
btnRedo = document.getElementById('btnRedo');

function enableButton(btnID) {
    $().disabled = true;
}

function updateUI() {
    btnUndo.disabled = !undoManager.hasUndo();
    btnRedo.disabled = !undoManager.hasRedo();
}
undoManager.setCallback(updateUI);

updateUI();