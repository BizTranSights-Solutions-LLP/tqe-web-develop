import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../../safe.pipe';
import { TruncatePipe } from '../../limit.pipe';
import { DateTimeFormatPipe } from '../../date.pipe';

@NgModule({
  declarations: [
    SafePipe,
    TruncatePipe,
    DateTimeFormatPipe
  ],
  imports: [
    
  ],
  exports: [
    CommonModule,
    SafePipe,
    TruncatePipe,
    DateTimeFormatPipe
  ]
})
export class SharedModule { }
