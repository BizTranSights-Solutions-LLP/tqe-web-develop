import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject  } from 'rxjs';
import { Router } from "@angular/router";
import { ToolService } from '../../services/tool.service';


@Component({
  selector: 'app-tool-listing',
  templateUrl: './tool-listing.component.html',
  styleUrls: ['./tool-listing.component.css']
})
export class ToolListingComponent implements OnInit, OnDestroy {

  getToolListSub: Subscription;  
  deleteToolSub: Subscription; 
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  tools = [];
  Loading = false;
  

  constructor(private toolService: ToolService, private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.getToolListSub = this.toolService.get_tool_listing().subscribe(
      (response) => {
        if(response.result){
          this.tools = response['result']['tool_data'];
          this.Loading = true;
          // Calling the DT trigger to manually render the table
          this.dtTrigger.next();                    
        } 
      },
      (err) => {
        if(err.status === 401) {
          localStorage.removeItem('data');
          this.router.navigate(['admin-auth/login']);
        }
      }         
      );    
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.getToolListSub ? this.getToolListSub.unsubscribe(): '';
    this.deleteToolSub ? this.deleteToolSub.unsubscribe(): '';
  }

  editTool(toolId) {
    this.router.navigate(['/admin/tool-form/', toolId]);    
  }

  deleteTool(toolId, index) {

    // console.log(toolId, index)

    if (!window.confirm('Are you sure you want to delete ?') ) {
      return false;
    }

    let toolData = {
      tool_id: toolId
    }   
  
    this.deleteToolSub = this.toolService.delete_tool(toolData).subscribe( 
      (response) => {

        if (response.meta.code === 200) {

          console.log('resp',response);
          var tools = [...this.tools] ;
          tools.splice(index, 1);
          this.tools = tools;
        }
        
      },
      (error) => console.log('error',error) 
      ); 
  }



}
 