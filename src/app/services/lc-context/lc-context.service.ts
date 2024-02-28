import { Injectable } from '@angular/core';
import { LightningChart, lightningChart } from '@arction/lcjs';

@Injectable({
  providedIn: 'root',
})
export class LcContextService {
  private lc?: LightningChart;

  constructor() {}

  public getLightningChartContext() {
    if (this.lc) return this.lc;
    this.lc = lightningChart({
      license:
        // Place your LCJS license key here
        // This should originate from a environment variable / secret. In development, license is assigned per developer, whereas in staging/production a deployment license is used.
        '',
    });
    return this.lc;
  }
}
