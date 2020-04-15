import { Component } from '@angular/core';

// To import json files set "resolveJsonModule": true, in compiler options in tsconfig.json
import * as data from './../assets/data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public headers = ['Available Users', 'Selected Users'];
  public columnNames = [
    { key: 'firstname', value: 'First name' },
    { key: 'lastname', value: 'Last name' },
    { key: 'company', value: 'Company' }
  ]; // key should match keys of data
  public availableUsers = (data as any).default; // Copying JSON data

  public onSelectedChanged(selectedItems) {
    console.table(selectedItems);
  }
}
