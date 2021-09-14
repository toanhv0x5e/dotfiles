"use strict";
function toggleOptionsBar(shouldCollapse) {
    const el = _getById('options-bar-icon');
    if (shouldCollapse === undefined) {
        if (el.classList.contains('fa-chevron-down')) {
            shouldCollapse = true;
        }
        else {
            shouldCollapse = false;
        }
    }
    document.documentElement.style
        .setProperty('--extension-options-bar-display', shouldCollapse ? `none` : `block`);
    if (vscode) {
        const lastState = _getVsState();
        vscode.setState(Object.assign(Object.assign({}, lastState), { previewIsCollapsed: shouldCollapse }));
    }
    if (shouldCollapse) {
        el.classList.remove('fa-chevron-down');
        el.classList.add('fa-chevron-right');
        onResizeGrid();
        _setPreviewCollapsedVsState(shouldCollapse);
        return;
    }
    el.classList.add('fa-chevron-down');
    el.classList.remove('fa-chevron-right');
    onResizeGrid();
    _setPreviewCollapsedVsState(shouldCollapse);
}
function _applyHasHeader(displayRenderInformation, fromUndo = false) {
    const el = hasHeaderReadOptionInput;
    const autoApplyHasHeader = shouldApplyHasHeaderAfterRowsAdded;
    setShouldAutpApplyHasHeader(false);
    const elWrite = _getById('has-header-write');
    let func = () => {
        if (!hot)
            throw new Error('table was null');
        if (el.checked || autoApplyHasHeader) {
            const dataWithIndex = getFirstRowWithIndex();
            if (dataWithIndex === null) {
                const el3 = _getById('has-header');
                el3.checked = false;
                headerRowWithIndex = null;
                return;
            }
            if (fromUndo)
                return;
            headerRowWithIndex = dataWithIndex;
            el.checked = true;
            hot.updateSettings({
                fixedRowsTop: 0,
                fixedColumnsLeft: 0,
            }, false);
            let hasAnyChangesBefore = getHasAnyChangesUi();
            hot.alter('remove_row', headerRowWithIndex.physicalIndex);
            elWrite.checked = true;
            defaultCsvWriteOptions.header = true;
            defaultCsvReadOptions._hasHeader = true;
            if (isFirstHasHeaderChangedEvent) {
                if (hasAnyChangesBefore === false) {
                    _setHasUnsavedChangesUiIndicator(false);
                }
                isFirstHasHeaderChangedEvent = false;
            }
            let undoPlugin = hot.undoRedo;
            undoPlugin.clear();
            hot.render();
            return;
        }
        if (fromUndo)
            return;
        if (headerRowWithIndex === null) {
            throw new Error('could not insert header row');
        }
        let hasAnyChangesBefore = getHasAnyChangesUi();
        hot.alter('insert_row', headerRowWithIndex.physicalIndex);
        const visualRow = hot.toVisualRow(headerRowWithIndex.physicalIndex);
        const visualCol = hot.toVisualColumn(0);
        hot.populateFromArray(visualRow, visualCol, [[...headerRowWithIndex.row]]);
        headerRowWithIndex = null;
        elWrite.checked = false;
        defaultCsvWriteOptions.header = false;
        defaultCsvReadOptions._hasHeader = false;
        hot.updateSettings({
            fixedRowsTop: fixedRowsTop,
            fixedColumnsLeft: fixedColumnsLeft,
        }, false);
        if (isFirstHasHeaderChangedEvent) {
            if (hasAnyChangesBefore === false) {
                _setHasUnsavedChangesUiIndicator(false);
            }
            isFirstHasHeaderChangedEvent = false;
        }
        let undoPlugin = hot.undoRedo;
        undoPlugin.clear();
        hot.render();
    };
    if (displayRenderInformation) {
        statusInfo.innerText = `Rendering table...`;
        call_after_DOM_updated(() => {
            func();
            setTimeout(() => {
                statusInfo.innerText = '';
            }, 0);
        });
        return;
    }
    func();
}
function setShouldAutpApplyHasHeader(shouldSet) {
    if (shouldSet) {
        shouldApplyHasHeaderAfterRowsAdded = true;
        hasHeaderReadOptionInput.classList.add(`toggle-auto-future`);
        hasHeaderLabel.title = `Activated automatically, if table has >= 2 rows`;
    }
    else {
        hasHeaderReadOptionInput.classList.remove(`toggle-auto-future`);
        shouldApplyHasHeaderAfterRowsAdded = false;
        hasHeaderLabel.title = ``;
    }
}
function checkAutoApplyHasHeader() {
    if (!shouldApplyHasHeaderAfterRowsAdded)
        return;
    tryApplyHasHeader();
}
function tryApplyHasHeader() {
    if (!hot)
        return;
    const uiShouldApply = hasHeaderReadOptionInput.checked;
    const canApply = checkIfHasHeaderReadOptionIsAvailable(false);
    if (uiShouldApply) {
        if (!canApply) {
            if (shouldApplyHasHeaderAfterRowsAdded) {
                setShouldAutpApplyHasHeader(false);
                return;
            }
            setShouldAutpApplyHasHeader(true);
            return;
        }
    }
    _applyHasHeader(true, false);
}
function setDelimiterString() {
    const el = _getById('delimiter-string');
    defaultCsvReadOptions.delimiter = el.value;
}
function setCommentString() {
    const el = _getById('comment-string');
    defaultCsvReadOptions.comments = el.value === '' ? false : el.value;
}
function setQuoteCharString() {
    const el = _getById('quote-char-string');
    ensuredSingleCharacterString(el);
    defaultCsvReadOptions.quoteChar = el.value;
}
function setEscapeCharString() {
    const el = _getById('escape-char-string');
    ensuredSingleCharacterString(el);
    defaultCsvReadOptions.escapeChar = el.value;
}
function setSkipEmptyLines() {
}
function setReadDelimiter(delimiter) {
    const el = _getById('delimiter-string');
    el.value = delimiter;
    defaultCsvReadOptions.delimiter = delimiter;
}
function setHasHeaderWrite() {
    const el = _getById('has-header-write');
    defaultCsvWriteOptions.header = el.checked;
}
function setDelimiterStringWrite() {
    const el = _getById('delimiter-string-write');
    defaultCsvWriteOptions.delimiter = el.value;
}
function setCommentStringWrite() {
    const el = _getById('comment-string-write');
    defaultCsvWriteOptions.comments = el.value === '' ? false : el.value;
}
function setQuoteCharStringWrite() {
    const el = _getById('quote-char-string-write');
    ensuredSingleCharacterString(el);
    defaultCsvWriteOptions.quoteChar = el.value;
}
function setEscapeCharStringWrite() {
    const el = _getById('escape-char-string-write');
    ensuredSingleCharacterString(el);
    defaultCsvWriteOptions.escapeChar = el.value;
}
function setQuoteAllFieldsWrite() {
    const el = _getById('quote-all-fields-write');
    defaultCsvWriteOptions.quoteAllFields = el.checked;
}
function setNewLineWrite() {
    const el = _getById('newline-select-write');
    if (el.value === '') {
        defaultCsvWriteOptions.newline = newLineFromInput;
    }
    else if (el.value === 'lf') {
        defaultCsvWriteOptions.newline = '\n';
    }
    else if (el.value === 'crlf') {
        defaultCsvWriteOptions.newline = '\r\n';
    }
}
function setWriteDelimiter(delimiter) {
    const el = _getById('delimiter-string-write');
    el.value = delimiter;
    defaultCsvWriteOptions.delimiter = delimiter;
}
function generateCsvPreview() {
    const value = getDataAsCsv(defaultCsvReadOptions, defaultCsvWriteOptions);
    const el = _getById('csv-preview');
    el.value = value;
    toggleOptionsBar(false);
}
function copyPreviewToClipboard() {
    generateCsvPreview();
    const el = _getById('csv-preview');
    postCopyToClipboard(el.value);
}
function reRenderTable() {
    if (!hot)
        return;
    statusInfo.innerText = `Rendering table...`;
    call_after_DOM_updated(() => {
        hot.render();
        setTimeout(() => {
            statusInfo.innerText = ``;
        }, 0);
    });
}
function displayData(csvParseResult, csvReadConfig) {
    var _a;
    if (csvParseResult === null) {
        if (hot) {
            hot.getInstance().destroy();
            hot = null;
        }
        return;
    }
    _normalizeDataArray(csvParseResult, csvReadConfig);
    columnIsQuoted = csvParseResult.columnIsQuoted;
    headerRowWithIndex = null;
    const container = csvEditorDiv;
    if (hot) {
        hot.destroy();
        hot = null;
    }
    const initiallyHideComments = initialConfig ? initialConfig.initiallyHideComments : false;
    if (initiallyHideComments && typeof csvReadConfig.comments === 'string') {
        hiddenPhysicalRowIndices = _getCommentIndices(csvParseResult.data, csvReadConfig);
    }
    findWidgetInstance.setupFind();
    const showColumnHeaderNamesWithLettersLikeExcel = (_a = initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.showColumnHeaderNamesWithLettersLikeExcel) !== null && _a !== void 0 ? _a : false;
    let defaultColHeaderFuncBound = defaultColHeaderFunc.bind(this, showColumnHeaderNamesWithLettersLikeExcel);
    isInitialHotRender = true;
    hot = new Handsontable(container, {
        data: csvParseResult.data,
        trimWhitespace: false,
        rowHeaderWidth: getRowHeaderWidth(csvParseResult.data.length),
        renderAllRows: false,
        rowHeaders: function (row) {
            let text = (row + 1).toString();
            if (csvParseResult.data.length === 1) {
                return `${text} <span class="remove-row clickable" onclick="removeRow(${row})" style="visibility: hidden"><i class="fas fa-trash"></i></span>`;
            }
            return `${text} <span class="remove-row clickable" onclick="removeRow(${row})"><i class="fas fa-trash"></i></span>`;
        },
        afterChange: onAnyChange,
        fillHandle: false,
        undo: true,
        colHeaders: defaultColHeaderFuncBound,
        currentColClassName: 'foo',
        currentRowClassName: 'foo',
        comments: false,
        search: {
            queryMethod: customSearchMethod,
            searchResultClass: 'search-result-cell',
        },
        wordWrap: enableWrapping,
        autoColumnSize: initialColumnWidth > 0 ? {
            maxColumnWidth: initialColumnWidth
        } : true,
        manualRowMove: true,
        manualRowResize: true,
        manualColumnMove: true,
        manualColumnResize: true,
        columnSorting: true,
        fixedRowsTop: fixedRowsTop,
        fixedColumnsLeft: fixedColumnsLeft,
        contextMenu: {
            callback: function (key, ...others) {
            },
            items: {
                'row_above': {
                    callback: function () {
                        insertRowAbove();
                    }
                },
                'row_below': {
                    callback: function () {
                        insertRowBelow();
                    }
                },
                '---------': {
                    name: '---------'
                },
                'col_left': {
                    callback: function () {
                        insertColLeft();
                    }
                },
                'col_right': {
                    callback: function () {
                        insertColRight();
                    }
                },
                '---------2': {
                    name: '---------'
                },
                'remove_row': {
                    disabled: function () {
                        const selection = hot.getSelected();
                        let allRowsAreSelected = false;
                        if (selection) {
                            const selectedRowsCount = Math.abs(selection[0][0] - selection[0][2]);
                            allRowsAreSelected = hot.countRows() === selectedRowsCount + 1;
                        }
                        return hot.countRows() === 1 || allRowsAreSelected;
                    }
                },
                'remove_col': {
                    disabled: function () {
                        const selection = hot.getSelected();
                        let allColsAreSelected = false;
                        if (selection) {
                            const selectedColsCount = Math.abs(selection[0][1] - selection[0][3]);
                            allColsAreSelected = hot.countCols() === selectedColsCount + 1;
                        }
                        return hot.countCols() === 1 || allColsAreSelected;
                    }
                },
                '---------3': {
                    name: '---------'
                },
                'alignment': {},
            }
        },
        outsideClickDeselects: false,
        cells: highlightCsvComments
            ? function (row, col) {
                var cellProperties = {};
                cellProperties.renderer = 'commentValueRenderer';
                return cellProperties;
            }
            : undefined,
        beforeColumnResize: function (oldSize, newSize, isDoubleClick) {
            if (oldSize === newSize) {
                if (initialConfig) {
                    return initialConfig.doubleClickColumnHandleForcedWith;
                }
                else {
                    console.log(`initialConfig is falsy`);
                }
            }
        },
        afterColumnResize: function () {
        },
        afterPaste: function () {
        },
        enterMoves: function (event) {
            if (!hot)
                throw new Error('table was null');
            lastHandsonMoveWas = 'enter';
            const selection = hot.getSelected();
            const _default = {
                row: 1,
                col: 0
            };
            if (!initialConfig || initialConfig.lastRowEnterBehavior !== 'createRow')
                return _default;
            if (!selection || selection.length === 0)
                return _default;
            if (selection.length > 1)
                return _default;
            const rowCount = hot.countRows();
            const selected = selection[0];
            if (selected[0] !== selected[2] || selected[0] !== rowCount - 1)
                return _default;
            if (event.key.toLowerCase() === 'enter' && event.shiftKey === false) {
                addRow(false);
            }
            return _default;
        },
        tabMoves: function (event) {
            if (!hot)
                throw new Error('table was null');
            lastHandsonMoveWas = 'tab';
            const selection = hot.getSelected();
            const _default = {
                row: 0,
                col: 1
            };
            if (!initialConfig || initialConfig.lastColumnTabBehavior !== 'createColumn')
                return _default;
            if (!selection || selection.length === 0)
                return _default;
            if (selection.length > 1)
                return _default;
            const colCount = hot.countCols();
            const selected = selection[0];
            if (selected[1] !== selected[3] || selected[1] !== colCount - 1)
                return _default;
            if (event.key.toLowerCase() === 'tab' && event.shiftKey === false) {
                addColumn(false);
            }
            return _default;
        },
        afterBeginEditing: function () {
            if (!initialConfig || !initialConfig.selectTextAfterBeginEditCell)
                return;
            const textarea = document.getElementsByClassName("handsontableInput");
            if (!textarea || textarea.length === 0 || textarea.length > 1)
                return;
            const el = textarea.item(0);
            if (!el)
                return;
            el.setSelectionRange(0, el.value.length);
        },
        beforeCopy: function (data, coords) {
        },
        afterUndo: function (action) {
        },
        beforeRedo: function (action) {
        },
        afterRender: function (isForced) {
            if (!isForced || isInitialHotRender)
                return;
            syncColWidths();
        },
        afterColumnMove: function (startColVisualIndices, endColVisualIndex) {
            if (!hot)
                throw new Error('table was null');
            if (headerRowWithIndex !== null) {
                let temp = headerRowWithIndex;
                const headerRowTexts = startColVisualIndices.map(p => temp.row[p]);
                let headerRowCopy = [];
                for (let i = 0; i <= headerRowWithIndex.row.length; i++) {
                    const colText = i < headerRowWithIndex.row.length ? headerRowWithIndex.row[i] : null;
                    let startIndex = startColVisualIndices.indexOf(i);
                    if (startIndex !== -1) {
                        continue;
                    }
                    if (i === endColVisualIndex) {
                        headerRowCopy.push(...headerRowTexts);
                    }
                    if (i >= headerRowWithIndex.row.length)
                        continue;
                    headerRowCopy.push(colText);
                }
                headerRowWithIndex.row = headerRowCopy;
            }
            if (columnIsQuoted) {
                const startQuoteInformation = startColVisualIndices.map(p => columnIsQuoted[p]);
                let quoteCopy = [];
                for (let i = 0; i <= columnIsQuoted.length; i++) {
                    const quoteInfo = i < columnIsQuoted.length ? columnIsQuoted[i] : false;
                    let startIndex = startColVisualIndices.indexOf(i);
                    if (startIndex !== -1) {
                        continue;
                    }
                    if (i === endColVisualIndex) {
                        quoteCopy.push(...startQuoteInformation);
                    }
                    if (i >= columnIsQuoted.length)
                        continue;
                    quoteCopy.push(quoteInfo);
                }
                columnIsQuoted = quoteCopy;
            }
            onAnyChange();
        },
        afterRowMove: function (startRow, endRow) {
            if (!hot)
                throw new Error('table was null');
            onAnyChange();
        },
        afterGetRowHeader: function (visualRowIndex, th) {
            const tr = th.parentNode;
            if (!tr || !hot)
                return;
            let physicalIndex = hot.toPhysicalRow(visualRowIndex);
            if (hiddenPhysicalRowIndices.indexOf(physicalIndex) === -1) {
                tr.classList.remove('hidden-row');
                if (tr.previousElementSibling) {
                    tr.previousElementSibling.classList.remove('hidden-row-previous-row');
                }
            }
            else {
                tr.classList.add('hidden-row');
                if (tr.previousElementSibling) {
                    tr.previousElementSibling.classList.add('hidden-row-previous-row');
                }
            }
        },
        afterCreateCol: function (visualColIndex, amount) {
            if (!hot)
                return;
            if (headerRowWithIndex) {
                const physicalIndex = hot.toPhysicalColumn(visualColIndex);
                headerRowWithIndex.row.splice(physicalIndex, 0, ...Array(amount).fill(null));
            }
            if (columnIsQuoted) {
                const physicalIndex = hot.toPhysicalColumn(visualColIndex);
                columnIsQuoted.splice(physicalIndex, 0, ...Array(amount).fill(newColumnQuoteInformationIsQuoted));
            }
            onAnyChange();
        },
        afterRemoveCol: function (visualColIndex, amount) {
            pre_afterRemoveCol(visualColIndex, amount);
        },
        afterCreateRow: function (visualRowIndex, amount) {
            pre_afterCreateRow(visualRowIndex, amount);
        },
        afterRemoveRow: function (visualRowIndex, amount) {
            if (!hot)
                return;
            for (let i = 0; i < hiddenPhysicalRowIndices.length; i++) {
                const hiddenPhysicalRowIndex = hiddenPhysicalRowIndices[i];
                if (hiddenPhysicalRowIndex >= visualRowIndex) {
                    hiddenPhysicalRowIndices[i] -= amount;
                }
            }
            if (headerRowWithIndex) {
                const lastValidIndex = hot.countRows();
                if (headerRowWithIndex.physicalIndex > lastValidIndex) {
                    headerRowWithIndex.physicalIndex = lastValidIndex;
                }
            }
            onAnyChange();
        },
        beforeSetRangeStartOnly: function (coords) {
        },
        beforeSetRangeStart: function (coords) {
            if (!hot)
                return;
            if (hiddenPhysicalRowIndices.length === 0)
                return;
            const lastPossibleRowIndex = hot.countRows() - 1;
            const lastPossibleColIndex = hot.countCols() - 1;
            const actualSelection = hot.getSelectedLast();
            let columnIndexModifier = 0;
            const isLastOrFirstRowHidden = hiddenPhysicalRowIndices.indexOf(lastPossibleRowIndex) !== -1
                || hiddenPhysicalRowIndices.indexOf(0) !== -1;
            let direction = 1;
            if (actualSelection) {
                const actualPhysicalIndex = hot.toPhysicalRow(actualSelection[0]);
                direction = actualPhysicalIndex < coords.row ? 1 : -1;
                if (isLastOrFirstRowHidden && coords.row === lastPossibleRowIndex && actualPhysicalIndex === 0) {
                    direction = -1;
                }
                else if (isLastOrFirstRowHidden && coords.row === 0 && actualPhysicalIndex === lastPossibleRowIndex) {
                    direction = 1;
                }
            }
            const getNextRow = (visualRowIndex) => {
                let visualRow = visualRowIndex;
                let physicalIndex = hot.toPhysicalRow(visualRowIndex);
                if (visualRow > lastPossibleRowIndex) {
                    columnIndexModifier = 1;
                    return getNextRow(0);
                }
                if (visualRow < 0) {
                    columnIndexModifier = -1;
                    return getNextRow(lastPossibleRowIndex);
                }
                if (hiddenPhysicalRowIndices.indexOf(physicalIndex) !== -1) {
                    return getNextRow(visualRow + direction);
                }
                return visualRow;
            };
            coords.row = getNextRow(coords.row);
            if (lastHandsonMoveWas !== 'tab') {
                coords.col = coords.col + (isLastOrFirstRowHidden ? columnIndexModifier : 0);
            }
            if (coords.col > lastPossibleColIndex) {
                coords.col = 0;
            }
            else if (coords.col < 0) {
                coords.col = lastPossibleColIndex;
            }
            lastHandsonMoveWas = null;
        },
        beforeSetRangeEnd: function () {
        },
        rowHeights: function (visualRowIndex) {
            let defaultHeight = 23;
            if (!hot)
                return defaultHeight;
            const actualPhysicalIndex = hot.toPhysicalRow(visualRowIndex);
            if (hiddenPhysicalRowIndices.includes(actualPhysicalIndex)) {
                return 0.000001;
            }
            return defaultHeight;
        },
        beforeKeyDown: function (event) {
            if (event.ctrlKey && event.shiftKey && event.altKey && event.key === 'ArrowDown') {
                event.stopImmediatePropagation();
                insertRowBelow();
            }
            else if (event.ctrlKey && event.shiftKey && event.altKey && event.key === 'ArrowUp') {
                event.stopImmediatePropagation();
                insertRowAbove();
            }
            else if (event.ctrlKey && event.shiftKey && event.altKey && event.key === 'ArrowLeft') {
                event.stopImmediatePropagation();
                insertColLeft();
            }
            else if (event.ctrlKey && event.shiftKey && event.altKey && event.key === 'ArrowRight') {
                event.stopImmediatePropagation();
                insertColRight();
            }
        },
    });
    Handsontable.dom.addEvent(window, 'resize', throttle(onResizeGrid, 200));
    if (typeof afterHandsontableCreated !== 'undefined')
        afterHandsontableCreated(hot);
    hot.addHook('afterRender', afterRenderForced);
    const oldShouldApplyHeaderReadOption = defaultCsvReadOptions._hasHeader;
    const settingsApplied = checkIfHasHeaderReadOptionIsAvailable(true);
    if (oldShouldApplyHeaderReadOption === true) {
        if (settingsApplied === true) {
            _applyHasHeader(true, false);
            updateFixedRowsCols();
        }
        else {
            setShouldAutpApplyHasHeader(true);
        }
    }
    isInitialHotRender = false;
    if (allColWidths && allColWidths.length > 0) {
        applyColWidths();
    }
    onResizeGrid();
    afterHandsontableCreated(hot);
    if (hot) {
        hot.selectCell(0, 0);
    }
}
function onAnyChange(changes, reason) {
    if (changes === null && reason && reason.toLowerCase() === 'loaddata') {
        return;
    }
    if (reason && reason === 'edit' && changes && changes.length > 0) {
        const hasChanges = changes.some(p => p[2] !== p[3]);
        if (!hasChanges)
            return;
    }
    if (findWidgetInstance.findWidgetInputValueCache !== '') {
        findWidgetInstance.tableHasChangedAfterSearch = true;
        findWidgetInstance.showOrHideOutdatedSearchIndicator(true);
    }
    postSetEditorHasChanges(true);
}
function onResizeGrid() {
    if (!hot)
        return;
    const widthString = getComputedStyle(csvEditorWrapper).width;
    if (!widthString) {
        _error(`could not resize table, width string was null`);
        return;
    }
    const width = parseInt(widthString.substring(0, widthString.length - 2));
    const heightString = getComputedStyle(csvEditorWrapper).height;
    if (!heightString) {
        _error(`could not resize table, height string was null`);
        return;
    }
    const height = parseInt(heightString.substring(0, heightString.length - 2));
    hot.updateSettings({
        width: width,
        height: height,
    }, false);
    syncColWidths();
}
function applyColWidths() {
    if (!hot)
        return;
    hot.getSettings().manualColumnResize = false;
    hot.updateSettings({ colWidths: allColWidths }, false);
    hot.getSettings().manualColumnResize = true;
    hot.updateSettings({}, false);
    hot.getPlugin('autoColumnSize').enablePlugin();
}
function syncColWidths() {
    allColWidths = _getColWidths();
}
function _getColWidths() {
    if (!hot)
        return;
    return hot.getColHeader().map(function (header, index) {
        return hot.getColWidth(index);
    });
}
function defaultColHeaderFunc(useLettersAsColumnNames, colIndex, colName) {
    let text = useLettersAsColumnNames
        ? spreadsheetColumnLetterLabel(colIndex)
        : getSpreadsheetColumnLabel(colIndex);
    if (headerRowWithIndex !== null && colIndex < headerRowWithIndex.row.length) {
        let visualIndex = colIndex;
        if (hot) {
            visualIndex = hot.toVisualColumn(colIndex);
        }
        const data = headerRowWithIndex.row[visualIndex];
        if (data !== null) {
            text = data;
        }
    }
    if (colName !== undefined && colName !== null) {
        text = colName;
    }
    let visualIndex = colIndex;
    if (hot) {
        visualIndex = hot.toVisualColumn(colIndex);
        if (hot.countCols() === 1) {
            return `${text} <span class="remove-col clickable" onclick="removeColumn(${visualIndex})" style="visibility: hidden"><i class="fas fa-trash"></i></span>`;
        }
        return `${text} <span class="remove-col clickable" onclick="removeColumn(${visualIndex})"><i class="fas fa-trash"></i></span>`;
    }
    return visualIndex !== 0
        ? `${text} <span class="remove-col clickable" onclick="removeColumn(${visualIndex})"><i class="fas fa-trash"></i></span>`
        : `${text} <span class="remove-col clickable" onclick="removeColumn(${visualIndex})" style="visibility: hidden"><i class="fas fa-trash"></i></span>`;
}
function toggleHelpModal(isVisible) {
    if (isVisible) {
        helModalDiv.classList.add('is-active');
        return;
    }
    helModalDiv.classList.remove('is-active');
}
function toggleAskReadAgainModal(isVisible) {
    if (isVisible) {
        askReadAgainModalDiv.classList.add('is-active');
        return;
    }
    askReadAgainModalDiv.classList.remove('is-active');
}
function toggleAskReloadFileModalDiv(isVisible) {
    if (isVisible) {
        askReloadFileModalDiv.classList.add('is-active');
        return;
    }
    askReloadFileModalDiv.classList.remove('is-active');
}
function toggleSourceFileChangedModalDiv(isVisible) {
    if (isVisible) {
        sourceFileChangedDiv.classList.add('is-active');
        return;
    }
    sourceFileChangedDiv.classList.remove('is-active');
}
function resetData(content, csvReadOptions) {
    const _data = parseCsv(content, csvReadOptions);
    displayData(_data, csvReadOptions);
    onResizeGrid();
    toggleAskReadAgainModal(false);
}
function resetDataFromResetDialog() {
    toggleAskReadAgainModal(false);
    postSetEditorHasChanges(false);
    startRenderData();
}
function preReloadFileFromDisk() {
    const hasAnyChanges = getHasAnyChangesUi();
    if (hasAnyChanges) {
        toggleAskReloadFileModalDiv(true);
        return;
    }
    reloadFileFromDisk();
}
function reloadFileFromDisk() {
    toggleAskReloadFileModalDiv(false);
    toggleSourceFileChangedModalDiv(false);
    _setHasUnsavedChangesUiIndicator(false);
    postReloadFile();
}
function startReceiveCsvProgBar() {
    receivedCsvProgBar.value = 0;
    receivedCsvProgBarWrapper.style.display = "block";
}
function intermediateReceiveCsvProgBar() {
    receivedCsvProgBar.attributes.removeNamedItem('value');
}
function stopReceiveCsvProgBar() {
    receivedCsvProgBarWrapper.style.display = "none";
}
function postApplyContent(saveSourceFile) {
    const csvContent = getDataAsCsv(defaultCsvReadOptions, defaultCsvWriteOptions);
    if (document.activeElement !== document.body)
        document.activeElement.blur();
    _postApplyContent(csvContent, saveSourceFile);
}
function getRowHeaderWidth(rows) {
    const parentPadding = 5 * 2;
    const widthMultiplyFactor = 10;
    const iconPadding = 4;
    const binIcon = 14;
    const hiddenRowIcon = 10;
    const len = rows.toString().length * widthMultiplyFactor + binIcon + iconPadding + parentPadding + hiddenRowIcon;
    return len;
}
function trimAllCells() {
    if (!hot)
        throw new Error('table was null');
    const numRows = hot.countRows();
    const numCols = hot.countCols();
    const allData = getData();
    let data = '';
    let hasAnyChanges = false;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            data = allData[row][col];
            if (typeof data !== "string") {
                continue;
            }
            allData[row][col] = data.trim();
            if (allData[row][col] !== data) {
                hasAnyChanges = true;
            }
        }
    }
    if (headerRowWithIndex) {
        for (let col = 0; col < headerRowWithIndex.row.length; col++) {
            const data = headerRowWithIndex.row[col];
            if (typeof data !== "string") {
                continue;
            }
            headerRowWithIndex.row[col] = data.trim();
            if (headerRowWithIndex.row[col] !== data) {
                hasAnyChanges = true;
            }
        }
    }
    hot.updateSettings({
        data: allData
    }, false);
    if (hasAnyChanges) {
        onAnyChange();
    }
}
function showOrHideAllComments(show) {
    if (show) {
        showCommentsBtn.style.display = 'none';
        hideCommentsBtn.style.display = 'initial';
        hiddenPhysicalRowIndices = [];
    }
    else {
        showCommentsBtn.style.display = 'initial';
        hideCommentsBtn.style.display = 'none';
        if (hot) {
            hiddenPhysicalRowIndices = _getCommentIndices(getData(), defaultCsvReadOptions);
            hiddenPhysicalRowIndices = hiddenPhysicalRowIndices.map(p => hot.toPhysicalRow(p));
        }
    }
    if (!hot)
        return;
    hot.render();
}
function getAreCommentsDisplayed() {
    return showCommentsBtn.style.display === 'none';
}
function _setHasUnsavedChangesUiIndicator(hasUnsavedChanges) {
    if (hasUnsavedChanges) {
        unsavedChangesIndicator.classList.remove('op-hidden');
    }
    else {
        unsavedChangesIndicator.classList.add('op-hidden');
    }
}
function getHasAnyChangesUi() {
    return unsavedChangesIndicator.classList.contains("op-hidden") === false;
}
function _setIsWatchingSourceFileUiIndicator(isWatching) {
    if (isWatching) {
        sourceFileUnwatchedIndicator.classList.add('op-hidden');
    }
    else {
        sourceFileUnwatchedIndicator.classList.remove('op-hidden');
    }
}
function changeFontSizeInPx(fontSizeInPx) {
    document.documentElement.style.setProperty('--extension-font-size', `${fontSizeInPx.toString()}px`);
    if (fontSizeInPx <= 0) {
        document.body.classList.remove('extension-settings-font-size');
        document.body.classList.add('vs-code-settings-font-size');
    }
    else {
        document.body.classList.add('extension-settings-font-size');
        document.body.classList.remove('vs-code-settings-font-size');
    }
    reRenderTable();
}
function updateFixedRowsCols() {
    if (!hot)
        return;
    hot.updateSettings({
        fixedRowsTop: Math.max(fixedRowsTop, 0),
        fixedColumnsLeft: Math.max(fixedColumnsLeft, 0),
    }, false);
}
function incFixedRowsTop() {
    _changeFixedRowsTop(fixedRowsTop + 1);
}
function decFixedRowsTop() {
    _changeFixedRowsTop(fixedRowsTop - 1);
}
function _changeFixedRowsTop(newVal) {
    fixedRowsTop = Math.max(newVal, 0);
    fixedRowsTopInfoSpan.innerText = fixedRowsTop.toString();
    updateFixedRowsCols();
}
function _toggleFixedRowsText() {
    const isHidden = fixedRowsTopText.classList.contains('dis-hidden');
    if (isHidden) {
        fixedRowsTopText.classList.remove('dis-hidden');
    }
    else {
        fixedRowsTopText.classList.add('dis-hidden');
    }
}
function incFixedColsLeft() {
    _changeFixedColsLeft(fixedColumnsLeft + 1);
}
function decFixedColsLeft() {
    _changeFixedColsLeft(fixedColumnsLeft - 1);
}
function _changeFixedColsLeft(newVal) {
    fixedColumnsLeft = Math.max(newVal, 0);
    fixedColumnsTopInfoSpan.innerText = fixedColumnsLeft.toString();
    updateFixedRowsCols();
}
function _toggleFixedColumnsText() {
    const isHidden = fixedColumnsTopText.classList.contains('dis-hidden');
    if (isHidden) {
        fixedColumnsTopText.classList.remove('dis-hidden');
    }
    else {
        fixedColumnsTopText.classList.add('dis-hidden');
    }
}
const minSidebarWidthInPx = 150;
const collapseSidePanelThreshold = 60;
function setupSideBarResizeHandle() {
    let downX = null;
    let _style = window.getComputedStyle(sidePanel);
    let downWidth = minSidebarWidthInPx;
    sideBarResizeHandle.addEventListener(`mousedown`, (e) => {
        downX = e.clientX;
        _style = window.getComputedStyle(sidePanel);
        downWidth = parseInt(_style.width.substring(0, _style.width.length - 2));
        if (isNaN(downWidth))
            downWidth = minSidebarWidthInPx;
    });
    document.addEventListener(`mousemove`, throttle((e) => {
        if (downX === null)
            return;
        const delta = e.clientX - downX;
        sidePanel.style.width = `${Math.max(downWidth + delta, minSidebarWidthInPx)}px`;
        sidePanel.style.maxWidth = `${Math.max(downWidth + delta, minSidebarWidthInPx)}px`;
        if (vscode) {
            const isSidePanelCollapsed = getIsSidePanelCollapsed();
            if (e.clientX <= collapseSidePanelThreshold) {
                if (!isSidePanelCollapsed)
                    toggleSidePanel(true);
            }
            else {
                if (isSidePanelCollapsed)
                    toggleSidePanel(false);
            }
        }
        onResizeGrid();
    }, 200));
    document.addEventListener(`mouseup`, (e) => {
        downX = null;
    });
}
function getIsSidePanelCollapsed() {
    if (vscode) {
        return window.getComputedStyle(leftPanelToggleIconExpand).display === 'block';
    }
    return false;
}
function toggleSidePanel(shouldCollapse) {
    if (vscode && shouldCollapse === undefined) {
        const isSidePanelCollapsed = getIsSidePanelCollapsed();
        if (isSidePanelCollapsed) {
            shouldCollapse = false;
        }
        else {
            shouldCollapse = true;
        }
    }
    document.documentElement.style
        .setProperty('--extension-side-panel-display', shouldCollapse ? `none` : `flex`);
    document.documentElement.style
        .setProperty('--extension-side-panel-expand-icon-display', shouldCollapse ? `block` : `none`);
    document.documentElement.style
        .setProperty('--extension-side-panel-collapse-icon-display', shouldCollapse ? `none` : `block`);
    onResizeGrid();
    if (shouldCollapse) {
    }
    else {
        recalculateStats();
    }
}
let recordedHookActions;
let hook_list = [];
function afterRenderForced(isForced) {
    if (!isForced) {
        hook_list = [];
        recordedHookActions = [];
        return;
    }
    for (let i = 0; i < hook_list.length; i++) {
        const hookItem = hook_list[i];
        if (!recordedHookActions.includes(hookItem.actionName))
            continue;
        hookItem.action();
    }
    hook_list = [];
    recordedHookActions = [];
}
function pre_afterRemoveCol(visualColIndex, amount) {
    recordedHookActions.push("afterRemoveCol");
    hook_list.push({
        actionName: 'afterCreateRow',
        action: afterRemoveCol.bind(this, visualColIndex, amount)
    });
}
function afterRemoveCol(visualColIndex, amount) {
    if (!hot)
        return;
    if (headerRowWithIndex) {
        const physicalIndex = hot.toPhysicalColumn(visualColIndex);
        headerRowWithIndex.row.splice(physicalIndex, amount);
    }
    const sortConfigs = hot.getPlugin('columnSorting').getSortConfig();
    const sortedColumnIds = sortConfigs.map(p => hot.toPhysicalColumn(p.column));
    let removedColIds = [];
    for (let i = 0; i < amount; i++) {
        removedColIds.push(hot.toPhysicalColumn(visualColIndex + i));
    }
    if (sortedColumnIds.some(p => removedColIds.includes(p))) {
        hot.getPlugin('columnSorting').clearSort();
    }
    if (columnIsQuoted) {
        const physicalIndex = hot.toPhysicalColumn(visualColIndex);
        columnIsQuoted.splice(physicalIndex, amount);
    }
    allColWidths.splice(visualColIndex, 1);
    applyColWidths();
    onAnyChange();
}
function pre_afterCreateRow(visualRowIndex, amount) {
    recordedHookActions.push("afterCreateRow");
    hook_list.push({
        actionName: 'afterCreateRow',
        action: afterCreateRow.bind(this, visualRowIndex, amount)
    });
}
function afterCreateRow(visualRowIndex, amount) {
    for (let i = 0; i < hiddenPhysicalRowIndices.length; i++) {
        const hiddenPhysicalRowIndex = hiddenPhysicalRowIndices[i];
        if (hiddenPhysicalRowIndex >= visualRowIndex) {
            hiddenPhysicalRowIndices[i] += amount;
        }
    }
    onAnyChange();
    checkAutoApplyHasHeader();
}
//# sourceMappingURL=ui.js.map