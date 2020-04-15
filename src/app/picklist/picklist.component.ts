import {
	Component, OnInit, HostListener, Input, SimpleChanges, ViewChildren,
	QueryList, ChangeDetectorRef, Output, EventEmitter
} from '@angular/core';
import * as _ from 'lodash';

@Component({
	selector: 'k1-picklist',
	templateUrl: './picklist.component.html',
	styleUrls: ['./picklist.component.scss']
})
export class PicklistComponent implements OnInit {
	public available = [];
	public selected = [];
	private availableMarked = [];
	private selectedMarked = [];
	private lastAvailableMarked = null;
	private lastSelectedMarked = null;
	private sortedColumnName = null;
	private sortReverse = false;
	// private shiftAvailable = [];
	// private shiftSelected = [];

	@Input('headers') headers: string[] = null;
	@Input('columnNames') columnNames: { key: string, value: string }[];
	@Input('data') data;
	@Output() selectedChanged = new EventEmitter<any>();

	@ViewChildren('avaliableList') availableList: QueryList<any>;
	@ViewChildren('selectedList') selectedList: QueryList<any>;

	// Listening to keyboard events
	@HostListener('document:keydown', ['$event']) handleKeydownEvent(event: KeyboardEvent) {
		// Available has tab index -11 and selected has -12
		if (event.target['tabIndex'] === -11 || event.target['tabIndex'] === -12) {
			if (event.ctrlKey && event.keyCode === 65) {
				// Listeners to handle Ctrl + 'a'
				event.preventDefault();
				if (event.target['tabIndex'] === -11) {
					_.forEach(this.availableMarked, a => this.markAvailable(a));
					_.forEach(this.available, a => this.markAvailable(a));
				} else {
					_.forEach(this.selected, s => {
						if (this.selectedMarked.indexOf(s) === -1)
							this.markSelected(s);
					});
				}
			}
			// @TODO: Future scope - Handling shift + up/down arrow
			// else if (event.shiftKey && event.keyCode === 38) {
			// 	// Listeners to handle Shift + up arrow
			// 	event.preventDefault();
			// 	if (event.target['tabIndex'] === -11) {
			// 		const matched = this.available.indexOf(_.last(this.availableMarked));
			// 		if (matched > 0)
			// 			this.markAvailable(this.available[matched - 1]);
			// 	} else {
			// 		const matched = this.selected.indexOf(_.last(this.selectedMarked));
			// 		if (matched > 0)
			// 			this.markSelected(this.selected[matched - 1]);
			// 	}
			// } else if (event.shiftKey && event.keyCode === 40) {
			// 	// Listeners to handle Shift + down arrow
			// 	if (event.target['tabIndex'] === -11) {
			// 		const matched = this.available.indexOf(_.last(this.availableMarked));
			// 		if (matched < this.available.length - 2)
			// 			this.markAvailable(this.available[matched + 1]);
			// 	} else {
			// 		const matched = this.selected.indexOf(_.last(this.selectedMarked));
			// 		if (matched < this.available.length - 2)
			// 			this.markSelected(this.selected[matched + 1]);
			// 	}
			// }
		}
	}

	constructor(private cd: ChangeDetectorRef) { }

	ngOnInit() {
		this.sortedColumnName = this.columnNames[0].key;
		this.available = _.orderBy(this.data, [this.sortedColumnName], ['asc']);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.data) {
			this.clearSelected();
		}
	}

	public moveRight() {
		this.availableMarked.forEach(val => {
			var index = this.available.indexOf(val);
			if (index > -1) {
				this.available.splice(index, 1);
			}
		});
		this.selected = this.selected.concat(this.availableMarked);
		this.cd.detectChanges();
		this.selectedMarked.forEach(val => this.markSelected(val));
		this.availableMarked.forEach(val => this.markSelected(val));
		this.availableMarked = [];
		this.selectedHasChanged();
	}

	public moveLeft() {
		this.selectedMarked.forEach(val => {
			var index = this.selected.indexOf(val);
			if (index > -1) {
				this.selected.splice(index, 1);
			}
		});
		this.available = this.available.concat(this.selectedMarked);
		this.sortReverse = !this.sortReverse;
		this.sortByColumn(this.sortedColumnName);
		this.cd.detectChanges();
		this.availableMarked.forEach(val => this.markAvailable(val));
		this.selectedMarked.forEach(val => this.markAvailable(val));
		this.selectedMarked = [];
		this.selectedHasChanged();
	}

	public toggleAvailable(event: MouseEvent, val) {
		event.preventDefault();
		if (event.shiftKey) {
			const curr = this.available.indexOf(val);
			const prev = this.available.indexOf(this.lastAvailableMarked);
			let temp = [];
			if (prev === -1 || prev === curr) {
				temp = [val];
				this.lastAvailableMarked = val;
			} else {
				temp = prev < curr ? this.available.slice(prev, curr + 1) : this.available.slice(curr, prev + 1);
			}

			_.forEach(this.availableMarked, m => {
				const matched = temp.indexOf(m);
				if (matched > -1)
					temp.splice(matched, 1);
				else
					this.markAvailable(m);
			});
			_.forEach(temp, t => this.markAvailable(t));
		} else if (event.ctrlKey) {
			this.markAvailable(val);
			this.lastAvailableMarked = val;
		} else {
			_.forEach(this.availableMarked, d => this.markAvailable(d));
			this.markAvailable(val);
			this.lastAvailableMarked = val;
		}
	}

	public toggleSelected(event: MouseEvent, val) {
		event.preventDefault();
		if (event.shiftKey) {
			const curr = this.selected.indexOf(val);
			const prev = this.selected.indexOf(this.lastSelectedMarked);
			let temp = [];
			if (prev === -1 || prev === curr) {
				temp = [val];
				this.lastSelectedMarked = val;
			} else {
				temp = prev < curr ? this.selected.slice(prev, curr + 1) : this.selected.slice(curr, prev + 1);
			}

			_.forEach(this.selectedMarked, m => {
				const matched = temp.indexOf(m);
				if (matched > -1)
					temp.splice(matched, 1);
				else
					this.markSelected(m);
			});
			_.forEach(temp, t => this.markSelected(t));
		} else if (event.ctrlKey) {
			this.markSelected(val);
			this.lastSelectedMarked = val;
		} else {
			_.forEach(this.selectedMarked, d => this.markSelected(d));
			this.markSelected(val);
			this.lastSelectedMarked = val;
		}
	}

	private markAvailable(val) {
		const elem = this.availableList.find(item => item.nativeElement.id === val.uid).nativeElement;
		if (this.availableMarked.indexOf(val) === -1) {
			this.availableMarked = [...this.availableMarked, val];
			elem.className += ' selected';
		} else {
			elem.className = elem.className.split(' ').splice(0, elem.className.split(' ').length - 2).join(' ');
			this.availableMarked = this.availableMarked.filter(elem => {
				return elem !== val;
			});
		}
	}

	private markSelected(val) {
		const elem = this.selectedList.find(item => item.nativeElement.id === val.uid).nativeElement;
		if (this.selectedMarked.indexOf(val) === -1) {
			this.selectedMarked = [...this.selectedMarked, val];
			elem.className += ' selected';
		} else {
			elem.className = elem.className.split(' ').splice(0, elem.className.split(' ').length - 2).join(' ');
			this.selectedMarked = this.selectedMarked.filter(elem => {
				return elem !== val;
			});
		}
	}

	public shiftUp() {
		const sortedArray = _.sortBy(this.selectedMarked, v => this.selected.indexOf(v));
		if (!_.isEqual(sortedArray, this.selected.slice(0, sortedArray.length))) {
			_.forEach(sortedArray, (val, i) => {
				if (!_.isEqual(sortedArray.slice(0, i + 1), this.selected.slice(0, i + 1))) {
					const index = this.selected.indexOf(val);
					if (index > 0) {
						this.selected.splice(index - 1, 0, ...this.selected.splice(index, 1));
					}
				}
			});
			this.selectedHasChanged();
		}
	}

	public shiftDown() {
		const sortedArray = _.sortBy(this.selectedMarked, v => this.selected.indexOf(v));
		const len = this.selected.length;
		const moveLen = sortedArray.length;
		if (!_.isEqual(sortedArray, this.selected.slice(len - moveLen, len))) {
			_.forEachRight(sortedArray, (val, i) => {
				if (!_.isEqual(sortedArray.slice(i, moveLen), this.selected.slice(len - (moveLen - i), len))) {
					const index = this.selected.indexOf(val);
					if (index < len - 1) {
						this.selected.splice(index + 1, 0, ...this.selected.splice(index, 1));
					}
				}
			});
			this.selectedHasChanged();
		}
	}

	public sortByColumn(columnName: string) {
		this.sortReverse = (this.sortedColumnName === columnName) ? !this.sortReverse : false;
		this.sortedColumnName = columnName;
		this.available = _.orderBy(this.available, [columnName], [this.sortReverse ? 'desc' : 'asc']);
	}

	public clearSelected() {
		this.available = _.orderBy(this.data, [this.sortedColumnName], [this.sortReverse ? 'desc' : 'asc']);
		this.selected = [];
		_.forEach(this.availableMarked, d => this.markAvailable(d));
		this.availableMarked = [];
		_.forEach(this.selectedMarked, d => this.markSelected(d));
		this.selectedMarked = [];
		// this.shiftAvailable = [];
		// this.shiftSelected = [];
		this.selectedHasChanged();
	}

	private selectedHasChanged() {
		this.selectedChanged.emit(this.selected);
	}

}
