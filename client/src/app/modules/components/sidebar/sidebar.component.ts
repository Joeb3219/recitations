import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

	sidebarURLs: {
		url: string,
		name: string
	}[] = []

	constructor() { }

	ngOnInit() {
		this.generateLoggedOutSidebar();
	}

	generateLoggedOutSidebar(){
		this.sidebarURLs.push({
			url: 'foo',
			name: 'Foo',
		})
		this.sidebarURLs.push({
			url: 'bar',
			name: 'Bar',
		})
	}

}
