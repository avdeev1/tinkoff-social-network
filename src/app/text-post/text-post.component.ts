import {Component, Input, OnInit} from '@angular/core';

const MAX_POST_LENGTH = 600;

@Component({
  selector: 'app-text-post',
  templateUrl: './text-post.component.html',
  styleUrls: ['./text-post.component.less']
})

export class TextPostComponent implements OnInit {

  @Input() text: string;

  isLong: boolean;
  short: string;

  constructor() { }

  ngOnInit() {
    this.isLong = this.text.length > MAX_POST_LENGTH;
    if (this.isLong) {
      this.short = this.text.slice(0, MAX_POST_LENGTH) + '...';
    } else {
      this.short = this.text;
    }
  }

  showFull() {
    event.stopPropagation();
    this.short = this.text;
    this.isLong = false;
  }
}
