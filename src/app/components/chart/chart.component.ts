import { Component, OnDestroy, afterNextRender } from '@angular/core';
import { AxisScrollStrategies, Themes } from '@arction/lcjs';
import { DataService } from '../../services/data/data.service';
import { LcContextService } from '../../services/lc-context/lc-context.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnDestroy {
  containerId: string = '';
  destroyLC?: () => unknown;

  constructor(dataService: DataService, lcContextService: LcContextService) {
    // Generate random ID to us as the containerId for the chart and the target div id
    this.containerId = (Math.random() * 1_000_000_000).toFixed(0);

    // Only in browser (not server side); initialize LightningChart JS components
    afterNextRender(() => {
      const lc = lcContextService.getLightningChartContext();
      const container = document.getElementById(
        this.containerId
      ) as HTMLDivElement;
      const chart = lc.ChartXY({ container, theme: Themes.light });
      const axisX = chart
        .getDefaultAxisX()
        .setScrollStrategy(AxisScrollStrategies.progressive)
        .setDefaultInterval((state) => ({
          end: state.dataMax ?? 0,
          start: (state.dataMax ?? 0) - 100,
          stopAxisAfter: false,
        }));
      const areaSeries = chart
        .addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
        .setMaxSampleCount(10_000);

      const dataObservable = dataService.connect();
      const dataSubscription = dataObservable.subscribe((value) => {
        areaSeries.appendSample({ y: value });
      });

      // Cache function that destroys created LC resources
      this.destroyLC = () => {
        // NOTE: Important to dispose `chart` here, instead of `lc`. Otherwise we would dispose the shared LC context which may be used by other LC based components
        chart.dispose();
        dataSubscription.unsubscribe();
      };
    });
  }

  ngOnDestroy(): void {
    if (this.destroyLC) this.destroyLC();
  }
}
