import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit  } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, RichTextEditor } from '@syncfusion/ej2-angular-richtexteditor';
import { ArticleService } from '../../services/article.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { ToolService } from '../../services/tool.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../services/auth.service';

import { EditorConfigurations } from '../../config';
import { MediaLibraryService } from '../../services/media-library.service';

declare var $:any;
@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]

})

export class CreateArticleComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('gallery') localGallery: ModalDirective;
  // @ViewChild('file') file: ElementRef;

  galleryImages:any = [];
  styleForSelectedImage: any = {'border': '5px solid red', 'border-radius': '10px','margin': '2%', 'width': '20%'};
  libraryImageStyle: any = {'margin': '2%', 'width': '20%'};
  previousSelectedIndex: number;

  imageLoading = true;

  successMsg: string = '';
  errorMsg: string = '';

  // public imagePath;
  // imgURL: any;
  currentImageData: any;
  public message: string;
  loadingPreview: boolean = false;
  uploadingImage: boolean = false;
  paginationImgLoading: boolean = false;
  imageOffset: number = 0;
  uploadResponse = { status: '', message: '', filePath: '' };
  preparingImageGallery: boolean = false;

  saveArticleSub: Subscription; 
  getSportsTagsSub: Subscription; 
  findArticleByIdSub: Subscription; 

  public tools: object = {
    items: [
           'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
           'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
           'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
           'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
           'Indent', 'Outdent', '|', 'CreateLink','CreateTable', '|', 'ClearFormat', 'Print', 'SourceCode']
   };

  editorConfig: object = EditorConfigurations;

  sportsTags = [];
  article_tools = [];
  articleForm: FormGroup;
  submitted = false;

  disableBtn = false;
  loading = true;
  removeBtn = false;
  downloadImagesSubscription: Subscription;
  uploadImageSubscription: Subscription;
  selectMediaSubscription: Subscription;
  imageForEditorSubscription: Subscription;
  
  constructor(
    private articleService: ArticleService, 
    private route: ActivatedRoute, 
    private toolService: ToolService,
    private router: Router,
    private authService: AuthService,
    private mlService: MediaLibraryService
    ) {}

  async ngOnInit() {
    
    this.editorConfig['buttons'] = {
      'testBtn': this.customButton.bind(this)
    }

    var articleId = this.route.snapshot.paramMap.get("id");
    let role = Object.keys(this.authService.getUserDetail().roles_status);
    if(!articleId && role.indexOf('is_editor') > -1) {
      this.errorMsg = '403 Forbidden';
      this.removeBtn = true;
      window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
      setTimeout(()=>{ this.router.navigate(['admin/article-lists']); },3000);
    }
    articleId ? this.findArticleById(articleId): '';
    this.initializeForm();
    this.fetchSportsTags();

    try {
      let response = await this.toolService.get_tool_listing().toPromise();
      
      if(response.meta.code === 200) {
        let tools = response.result.tool_data.reduce((array, data) => {
          array.push({id: data.id,name: data.title});
          return array;
        },[]);
        this.article_tools = tools;
      }
    } catch(e) {
      this.is_Authenticate(e);
    }

    this.loading = false;
  }
  
  customButton() {
    return (context) => {
      const ui = $.summernote.ui;
      const button = ui.button({
        contents: 'Add Image',
        tooltip: 'Select image from the media library',
        click: () => {
          this.mlService.openML.emit({decide: true, mediaType: 'image', media_data: undefined, for_editor: true});
        }
      });
      return button.render();
    }
  }

  addContent(image_path: string) {
    // var selection = document.getSelection();
    // var cursorPos = selection.anchorOffset;
    // var oldContent = selection.anchorNode.nodeValue;
    var toInsert = "<img src="+ image_path +" />";
    // var newContent = oldContent.substring(0, cursorPos) + toInsert + oldContent.substring(cursorPos);
    // console.log(newContent);
    // selection.anchorNode.nodeValue = newContent;
    // selection.getRangeAt(0) = newContent;
    // var editor = $.summernote.eventHandler.getEditor();
    // editor.insertImage($('.note-editable'), 'https://stage.thequantedge.com/uploads/2019/09/51672_bridge18.png');
    $('#summernote-custom').summernote('editor.pasteHTML', toInsert);
  }

  ngAfterViewInit() {
    this.selectMediaSubscription = this.mlService.selectedMedia.subscribe(
      (res: any) => {
        this.currentImageData = res.selected;
        this.articleForm.patchValue({
          file_path: res.selected.file_path,
          image_id: res.selected.id
        });
      }
    );

    this.imageForEditorSubscription = this.mlService.imageForEditor.subscribe(
      (image: any) => {
        this.addContent(image.path);
      }
    );
  }

  ngOnDestroy() { 
    this.saveArticleSub ? this.saveArticleSub.unsubscribe(): '';
    this.getSportsTagsSub ? this.getSportsTagsSub.unsubscribe(): '';
    this.findArticleByIdSub ? this.findArticleByIdSub.unsubscribe(): '';
    this.imageForEditorSubscription ? this.imageForEditorSubscription.unsubscribe() : '';
    this.selectMediaSubscription ? this.selectMediaSubscription.unsubscribe() : '';
    // this.downloadImagesSubscription ? this.downloadImagesSubscription.unsubscribe(): '';
    // this.uploadImageSubscription ? this.uploadImageSubscription.unsubscribe(): '';
  }

  openML(file_type: string) {
    this.mlService.openML.emit({decide: true, mediaType: file_type, media_data: this.currentImageData});
  }

  removeAssociation(type: string, param: string) {
    this.articleForm.controls[param].setValue(null);
    this.articleForm.controls[type+'_id'].setValue(0);
    this.currentImageData = undefined;
  }

  // upload(files) {
  //   if (files.length === 0)
  //     return;
 
  //   var mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = "Only images are supported.";
  //     return;
  //   }

  //   this.errorMsg = '';
  //   let file = files[0];
    
  //   let formData = new FormData();
  //   formData.append('auth_code', this.authService.getUserDetail().auth_code);
  //   formData.append('image_title', file.name);
  //   formData.append('image', file);

  //   this.uploadingImage = true;
  //   this.uploadImageSubscription = this.articleService.upload_file(formData, file).subscribe((res: any) => {
  //     this.uploadResponse = res;
  //     if(res.status === 'done') {
  //       let response: any = res.message;
  //       if(response.meta.code === 200) {
  //         this.uploadingImage = false;
  //         this.file.nativeElement.value = '';
  //         this.imgURL = '';
  //         let image_data = response.result.image;

  //         this.articleForm.patchValue({
  //           file_path: image_data.file_path,
  //           image_id: image_data.id
  //         });

  //         this.galleryImages.map(d => {
  //           if(d.selected) {
  //             d['style'] = this.libraryImageStyle;
  //           }
  //           return d;
  //         });

  //         image_data['style'] = this.styleForSelectedImage;
  //         image_data['selected'] = true;

  //         this.galleryImages = [image_data].concat(this.galleryImages);
  //         this.gallery.hide();
  //       } else {
  //         this.message = response.meta.message;
  //         this.errorMsg = response.meta.message;
  //       }
  //     }
  //   },(err) => {
  //     this.errorMsg = err.statusText;
  //     this.uploadingImage = false;
  //     console.log(err);
  //     this.message = 'Connection Breaks!';
  //   });
  // }

  // resetFile() {
  //   if(!this.uploadingImage) {
  //     this.file.nativeElement.value = '';
  //     this.imgURL = '';
  //     this.uploadResponse = { status: '', message: '', filePath: '' };
  //   }
  // }

  // preview(files) {
  //   this.message = '';
  //   if (files.length === 0)
  //     return;
 
  //   var mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = "Only images are supported.";
  //     return;
  //   }
    
  //   this.loadingPreview = true;
  //   var reader = new FileReader();
  //   this.imagePath = files;
  //   reader.readAsDataURL(files[0]); 
  //   reader.onload = (_event) => { 
  //     this.imgURL = reader.result;
  //     this.loadingPreview = false; 
  //   }
  // }

  initializeForm() {

    this.articleForm = new FormGroup({
      article_id: new FormControl(''),
      title: new FormControl('',  Validators.required),
      content: new FormControl('',  Validators.required),
      article_sports_tag: new FormControl([]),

      article_meta_tag : new FormArray([
        this.createMetaTag()      
      ]),
      article_tool_association: new FormControl([]),
      image: new FormControl('', [this.imageValidation]),
      file_path: new FormControl(''),
      article_image: new FormControl(''),
      image_id: new FormControl(),
      // image_title: new FormControl(''),
      // image_desc: new FormControl(''),
      article_url: new FormControl(''),
      status: new FormControl('draft')
    });    
 
  }

  // selectLibraryImage(index: number, imgData: any) {
  //   this.galleryImages.map(d => {
  //     if(d.selected) {
  //       d.style = this.libraryImageStyle;
  //     }
  //     return d;
  //   });
  //   this.galleryImages[index]['style'] = this.styleForSelectedImage;
  //   this.galleryImages[index]['selected'] = true;
  //   this.articleForm.controls['file_path'].setValue(imgData.file_path);
  //   this.articleForm.controls['image_id'].setValue(imgData.id);
  // }

  // download_images() {

  //   if(this.galleryImages.length === 0) {
  //     let imageId = this.articleForm.get('image_id').value;
  //     this.downloadImagesSubscription = this.articleService.get_images().subscribe(
  //       (res:any) => {
  //         this.imageLoading = false;
  //         if(res.meta.code === 200) {
  //           let to_splice = -1;
  //           this.galleryImages = res.result.image_data.map((d,i) => {
  //             if(d.id === imageId) {
  //               to_splice = i;
  //             }else{ 
  //               d['style'] = this.libraryImageStyle;
  //               d['selected'] = false; 
  //             }
  //             return d;
  //           });
  //           this.imageOffset = 20;

  //           if(to_splice > -1) {
  //             // let image_to_append = this.galleryImages[to_splice];
  //             this.galleryImages.splice(to_splice, 1);
  //             // this.galleryImages = [image_to_append].concat(this.galleryImages);
  //           }

  //           if(this.currentImageData && Object.keys(this.currentImageData).length > 0) {
  //             let article_image = this.currentImageData;
  //             article_image['style'] = this.styleForSelectedImage;
  //             article_image['selected'] = true;

  //             this.galleryImages = [article_image].concat(this.galleryImages);
  //           }
  //           console.log(this.galleryImages);
  //           // this.articleService.imageLibrary = this.galleryImages;
  //         }
  //       },
  //       (err) => { 
  //         this.imageLoading = false;
  //         console.log(err);
  //         this.is_Authenticate(err); 
  //       }
  //     );
  //   }
  // }

  // @HostListener("scroll", ["$event"])
  // onWindowScroll(event) {
  //   if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
  //     if(!this.paginationImgLoading)
  //       this.download_images_again();
  //   }
  // }
  
  // download_images_again() {
  //   this.paginationImgLoading = true;
  //   let imageId = this.articleForm.get('image_id').value;
  //   this.downloadImagesSubscription = this.articleService.get_images(this.imageOffset).subscribe(
  //     (res:any) => {
  //       this.paginationImgLoading = false;
        
  //       if(res.meta.code === 200) {
  //         let to_splice = -1;
  //         let more_images = res.result.image_data.map((d,i) => {
  //           if(d.id === imageId) {
  //             to_splice = i;
  //           }else{ 
  //             d['style'] = this.libraryImageStyle;
  //             d['selected'] = false; 
  //           }
  //           return d;
  //         });
          
  //         this.imageOffset += 20;

  //         if(to_splice > -1) {
  //           more_images.splice(to_splice, 1);
  //         }

  //         this.galleryImages = this.galleryImages.concat(more_images);
  //       }
  //     },
  //     (err) => {
  //       this.paginationImgLoading = false;
  //       console.log(err);
  //       this.is_Authenticate(err); 
  //     }
  //   );
  // }

  imageValidation(formcontrol: AbstractControl) {

    var fileExtension = formcontrol.value ? formcontrol.value.split('.').pop() : '';

    if(fileExtension && fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'png')
    {
      return {'image': true}
    } 

    return null
  }

  fetchSportsTags() {

    this.getSportsTagsSub = this.articleService.get_sports_tags('article').subscribe(

      (response) => (
         this.formatSportsTags(response)
     ),
      (error) => {
        console.log('error',error);
        this.is_Authenticate(error);
      }
    );

  } 

  formatSportsTags(data) {
    let sportsTags = [];

    data.result.forEach(element => {

      // element.sports_tags.forEach( tag  => { 

        sportsTags.push(element)

      // })      
      
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

  createToolsTag() {

    return  new FormGroup({     
      name: new FormControl('')
      });
  }

  addCustomUser = (term) => ({id: term, name: term});

  onFileChange(event) {   

    var fileExtension = event.target.files[0] ? event.target.files[0].name.split('.').pop() : '';

    if( (event.target.files && event.target.files.length) && (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') )
    {
      
      const file = event.target.files[0];     
      console.log(file);
      //this.articleForm.patchValue({article_image: file}); 
      this.articleForm.get('article_image').setValue(file);   
    }
    
  }

  onSubmit(articleData) {
    // Process checkout data here 
    
    this.submitted = true;
    this.successMsg = '';
    this.errorMsg = '';

    // stop here if form is invalid
    if (this.articleForm.invalid) {
        return;
    }

    // console.log('Your article has been submitted', articleData);    
    this.disableBtn = true;
     this.saveArticleSub = this.articleService.save_article(articleData).subscribe( 
      (response) => {
        this.submitted = false;
        this.disableBtn = false;
        if(response.meta.code === 200) {
          this.articleForm.reset();
          this.router.navigate(['admin/article-lists']);
        } else {
          this.errorMsg = response.meta.message;
        }
      },
      (error) => {
        this.disableBtn = false;
        console.log('error',error)
        this.errorMsg = error.statusText;
        this.is_Authenticate(error);
      }); 

  }

   findArticleById(articleId) {

        let articleData = {
          article_id: articleId
        }
      
        this.findArticleByIdSub = this.articleService.find_article_by_id(articleData).subscribe(
          (response: any) => {
            this.loading = false;
            if(response.meta.code === 200 ){             
              this.setArticleFormFields(response.result);
              // console.log(response) 
            } else {
              this.errorMsg = response.meta.message;

              if('code' in response.result && response.result.code === 999) {
                this.removeBtn = true;
                window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
                setTimeout(()=>{ this.router.navigate(['admin/article-lists']); },3000);
              }
            }         
           
          },
          (error) => {
            this.loading = false;
            this.errorMsg = error.statusText;
            this.is_Authenticate(error);
          }); 
        }

   setArticleFormFields(data) {

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

    // image_title: data['images'][0] ? data['images'][0]['title']: '',
    // image_desc: data['images'][0] ? data['images'][0]['description']: '',

    this.articleForm.patchValue({
      article_id: data.id,
      title: data.title,
      content: data.content,
      article_sports_tag: sportsTags,
      article_meta_tag: metaTags[0] ? metaTags: [{title:'', keyword:'', description:''}], 
      image: '',
      article_image: '',
      file_path: data['images'][0] ? data['images'][0]['file_path']: '',
      image_id: data['images'][0] ? data['images'][0]['id']: '',
      article_url: data.article_url ? '/article/' + data.article_url: '',
      article_tool_association: data.tools,
      status: data.status ? data.status : 'draft'
    });

    if(data['images'].length > 0) {
      this.currentImageData = data.images[0];
    }
   }

  is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }
  
}
