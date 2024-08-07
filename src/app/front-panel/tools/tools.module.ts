import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsComponent } from './tools.component';
import { AllComponent } from './all/all.component';
import { ExcludedComponent } from './excluded/excluded.component';
import { LineupsComponent } from './lineups/lineups.component';
import { InjuryComponent } from './injury/injury.component';

import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PapaParseModule } from 'ngx-papaparse';

// import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared/shared.module';

@NgModule({
  declarations: [
    ToolsComponent,
    AllComponent, 
    ExcludedComponent,
    LineupsComponent, 
    InjuryComponent
  ],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    DataTablesModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    PapaParseModule,
    // TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToolsModule { }
