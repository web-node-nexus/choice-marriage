import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureConverterPipe } from './temperature-converter.pipe';
import { SpeedMeasurementPipe } from './speed-measurement.pipe';
import { FormatdropdownPipe } from './formatdropdown.pipe';
import { SafeUrlPipePipe } from './safe-url-pipe.pipe';
import { AgePipe } from './age.pipe';
import { FillterPipe } from './fillter.pipe';
import { FirstCharPipe } from './first-char.pipe';
import { TimedifferencePipe } from './timedifference.pipe';



@NgModule({
  declarations: [
    TemperatureConverterPipe,
    SpeedMeasurementPipe,
    FormatdropdownPipe,
    SafeUrlPipePipe,
    AgePipe,
    FillterPipe,
    FirstCharPipe,
    TimedifferencePipe

  ],
  imports: [
    CommonModule
  ],
  exports: [
    TemperatureConverterPipe,
    SpeedMeasurementPipe,
    FormatdropdownPipe,
    SafeUrlPipePipe,
    AgePipe,
    FillterPipe,
    FirstCharPipe,
    TimedifferencePipe
  ]
})
export class CustomPipeModule { }
