import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'mfloww-landing-image',
  templateUrl: './landing-image.component.html',
  styleUrls: ['./landing-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingImageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
