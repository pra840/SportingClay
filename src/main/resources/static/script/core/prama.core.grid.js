define(
    function (require) {
        var Backgrid = require('backgrid');
        var backbonePaginator = require('backbonePaginator');
        var backgridSelectAll = require('backgridSelectAll');
        var backgridFilter = require('backgridFilter');

        //override the function defined in backgrid-select-all.js
        Backgrid.Grid.prototype.getSelectedModels = function () {
            var selectAllHeaderCell;
            var headerCells = this.header.row.cells;
            for (var i = 0, l = headerCells.length; i < l; i++) {
                var headerCell = headerCells[i];
                if (headerCell instanceof Backgrid.Extension.SelectAllHeaderCell) {
                    selectAllHeaderCell = headerCell;
                    break;
                }
            }

            var result = [];
            if (selectAllHeaderCell) {
                var selectedModels = selectAllHeaderCell.selectedModels;

                var collection = this.collection.fullCollection || this.collection;
                for (var modelId in selectedModels) {
                    if (this.modelRetriever) {
                        result.push(this.modelRetriever(modelId));
                    } else {
                        result.push(collection.get(modelId));
                    }
                }
            }

            return result;
        };

        return Backgrid;
    }

);