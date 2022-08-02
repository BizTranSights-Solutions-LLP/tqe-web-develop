import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { ToolService } from '../../services/tool.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'] ,
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class ToolComponent implements OnInit,OnDestroy {

  saveToolSub: Subscription; 
  getSportsTagsSub: Subscription; 
  findToolByIdSub: Subscription; 

  public tools: object = {
    items: [
           'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
           'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
           'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
           'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
           'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
           'Image', '|', 'ClearFormat', 'Print', 'SourceCode']
   };
  sportsTags = [];
  toolForm: FormGroup;
  submitted = false;

  
  constructor(
    private toolService: ToolService, private route: ActivatedRoute  
     ){         
      }


  ngOnInit() {
   var toolId = this.route.snapshot.paramMap.get("id");
   toolId ? this.findToolById(toolId): '';   
   this.initializeForm();
   this.fetchSportsTags();

  } 

  ngOnDestroy() { 
  
    this.saveToolSub ? this.saveToolSub.unsubscribe(): '';
    this.getSportsTagsSub ? this.getSportsTagsSub.unsubscribe(): '';
    this.findToolByIdSub ? this.findToolByIdSub.unsubscribe(): '';
  }

  initializeForm() {

    this.toolForm = new FormGroup({
      tool_id: new FormControl(''),
      title: new FormControl('',  Validators.required),
      description: new FormControl('',  Validators.required),
      tool_sports_tag: new FormControl([]),

      tool_meta_tag : new FormArray([
        this.createMetaTag()      
      ]),     

      image: new FormControl('', [this.imageValidation]),
      file_path: new FormControl(''),
      tool_image: new FormControl(''),
      image_title: new FormControl(''),
      image_desc: new FormControl(''),
      short_description: new FormControl(''),
      iframe_url: new FormControl(''),
      video_url: new FormControl(''),
      button_text	: new FormControl(''),
      display_order	: new FormControl(''),
      tool_url: new FormControl('')
   
    });    

  }

  imageValidation(formcontrol: AbstractControl) {

    var fileExtension = formcontrol.value ? formcontrol.value.split('.').pop() : '';

    if(fileExtension && fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'png')
    {
      return {'image': true}
    } 

    return null
  }

  fetchSportsTags() {

    this.getSportsTagsSub = this.toolService.get_sports_tags().subscribe(

      (response) => (
         this.formatSportsTags(response)
     ),
      (error) => console.log('error',error)
      
    );

  }

  formatSportsTags(data) {

    let sportsTags = [];

    data.result.forEach(element => {

      element.sports_tags.forEach( tag  => { 

        sportsTags.push(tag)

      })      
      
    });

    this.sportsTags = sportsTags;

  }

  createMetaTag() {

    return  new FormGroup({     
      title: new FormControl(''),
      keyword: new FormControl(''),
      description: new FormControl(''),

      })     
  }

  addCustomUser = (term) => ({id: term, name: term});

  onFileChange(event) {   

    var fileExtension = event.target.files[0] ? event.target.files[0].name.split('.').pop() : '';

    if( (event.target.files && event.target.files.length) && (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') )
    {
      const file = event.target.files[0];     
   
      this.toolForm.get('tool_image').setValue(file);   
    }
    
  }

  onSubmit(toolData) {
    // Process checkout data here 
    
    this.submitted = true;

    // stop here if form is invalid
    if (this.toolForm.invalid) {
        return;
    }

    console.log('Your tool has been submitted', toolData);    

     this.saveToolSub = this.toolService.save_tool(toolData).subscribe( 
      (response) => {
        console.log('resp',response);
        this.submitted = false;
      },
      (error) => console.log('error',error) 
      ) ; 
   
     this.toolForm.reset();

  }

 
   findToolById(toolId) {


      let toolData = {
        tool_id: toolId
      }
      
      this.findToolByIdSub = this.toolService.find_tool_by_id(toolData).subscribe(
        (response) => {

          console.log(response) 
          if(response.meta.code === 200 ){             
            this.setToolFormFields(response.result);
             
          }         
          
        },
        (error) => console.log('error',error) 
        ); 
    }


   setToolFormFields(data) {

    
    let sportsTags = [], metaTags = [];

    data.sports_tags.forEach(element => {
      sportsTags.push(element.id)      
    });

    data.meta_tags.forEach(element => {
      metaTags.push({
        title: element.title,
        keyword: element.keyword,
        description: element.description
      })
      
    });


 
    this.toolForm.setValue({
      tool_id: data.id,
      title: data.title,
      description: data.description,
      tool_sports_tag: sportsTags,
      tool_meta_tag: metaTags[0] ? metaTags: [{title:'', keyword:'', description:''}], 
      image: '',
      tool_image: '',
      file_path: data['images'][0] ? data['images'][0]['file_path']: '',
      image_title: data['images'][0] ? data['images'][0]['title']: '',
      image_desc: data['images'][0] ? data['images'][0]['description']: '',
      short_description: data.short_description,
      iframe_url: data.iframe_url,
      video_url: data.video_url,
      button_text	: data.button_text,
      display_order	: data.display_order,
      tool_url: data.tool_url ? '/tool/' + data.tool_url: ''

    })

   }

}
