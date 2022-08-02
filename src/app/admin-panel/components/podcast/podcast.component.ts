import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { PodcastService } from '../../services/podcast.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import { EditorConfigurations } from '../../config';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ArticleService } from '../../services/article.service';
import { MediaLibraryService } from '../../services/media-library.service';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.css'] ,
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]

})
export class PodcastComponent implements OnInit, AfterViewInit, OnDestroy {
  // public Editor = ClassicEditor;
// public cktools: object = {
//   toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote','Source' ],
//   extraPlugins: 'embed,autoembed,image2,iframe',

//  };
editorConfig: object = EditorConfigurations;
  savePodcastSub: Subscription;
  getSportsTagsSub: Subscription;
  findPodcastByIdSub: Subscription;

  // @ViewChild('gallery') gallery: ModalDirective;
  // @ViewChild('file') file: ElementRef;

  // galleryImages:any = [];
  // styleForSelectedImage: any = {'border': '5px solid red', 'border-radius': '10px','margin': '2%', 'width': '20%'};
  // libraryImageStyle: any = {'margin': '2%', 'width': '20%'};
  // previousSelectedIndex: number;
  
  errorMsg: string = '';

  // public imagePath;
  // imgURL: any;
  currentImageData: any;
  currentFileData: any;
  // public message: string;
  // loadingPreview: boolean = false;
  // uploadingImage: boolean = false;
  // paginationImgLoading: boolean = false;
  // imageOffset: number = 0;
  // uploadResponse = { status: '', message: '', filePath: '' };
  // preparingImageGallery: boolean = false;

  // downloadImagesSubscription: Subscription;
  // uploadImageSubscription: Subscription;

  public tools: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen'],
   };

   public iframe: object = { enable: true };

  sportsTags = [];
  podcastForm: FormGroup;
  submitted = false;
  serverError: any;
  set_mp3: string = '';

  disableBtn: boolean = false;
  loading: boolean = true;
  removeBtn: boolean = false;
  imageLoading = true;


  constructor(
    private podcastService: PodcastService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private articleService: ArticleService,
    private mlService: MediaLibraryService
    ) {}


  ngOnInit() {

   var podcastId = this.route.snapshot.paramMap.get("id");
   podcastId ? this.findPodcastById(podcastId): '';
   this.initializeForm();
   this.fetchSportsTags();
   this.loading = false;

  }

  openML(file_type: string) {
    this.mlService.openML.emit({decide: true, mediaType: file_type, media_data: file_type === 'image' ? this.currentImageData : this.currentFileData});
  }

  removeAssociation(type: string) {
    if(type === 'image') {
      this.podcastForm.controls['file_path'].setValue(null);
      this.podcastForm.controls[type+'_id'].setValue(0);
      this.currentImageData = undefined;
    }else{
      this.podcastForm.controls[type+'_title'].setValue(null);
      this.podcastForm.controls[type+'_id'].setValue(0);
      this.currentFileData = undefined;
    }
  }

  ngAfterViewInit() {
    this.mlService.selectedMedia.subscribe(
      (res: any) => {
        if(res.type === 'image') {
          this.currentImageData = res.selected;
          this.podcastForm.patchValue({
            file_path: res.selected.file_path,
            image_id: res.selected.id
          });
        } else {
          this.currentFileData = res.selected;
          this.podcastForm.patchValue({
            file_id: res.selected.id,
            file_title: res.selected.name
          });
        }
      }
    );
  }

  ngOnDestroy() {
    this.savePodcastSub ? this.savePodcastSub.unsubscribe(): '';
    this.getSportsTagsSub ? this.getSportsTagsSub.unsubscribe(): '';
    this.findPodcastByIdSub ? this.findPodcastByIdSub.unsubscribe(): '';
    // this.downloadImagesSubscription ? this.downloadImagesSubscription.unsubscribe(): '';
    // this.uploadImageSubscription ? this.uploadImageSubscription.unsubscribe(): '';
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

  //         this.podcastForm.patchValue({
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

    this.podcastForm = new FormGroup({
      podcast_id: new FormControl(''),
      title: new FormControl('',  Validators.required),
      content: new FormControl('',  Validators.required),
      podcast_sports_tag: new FormControl([]),

      podcast_meta_tag : new FormArray([
        this.createMetaTag()
      ]),

      image: new FormControl('', [this.imageValidation]),
      file_path: new FormControl(''),
      podcast_image: new FormControl(''),
      podcast_audio: new FormControl(''),
      image_id: new FormControl(''),
      // image_title: new FormControl(''),
      // image_desc: new FormControl(''),
      podcast_url: new FormControl(''),
      podcast_file: new FormControl('', [this.audioValidation]),
      custom_file_url: new FormControl('', Validators.pattern(/^https?:\/\/.+/)),
      embedded_url: new FormControl(''),
      status: new FormControl('draft'),
      file_id: new FormControl(''),
      file_title: new FormControl('')
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
  //   this.podcastForm.controls['file_path'].setValue(imgData.file_path);
  //   this.podcastForm.controls['image_id'].setValue(imgData.id);
  // }

  // download_images() {

  //   if(this.galleryImages.length === 0) {
  //     let imageId = this.podcastForm.get('image_id').value;
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
  //   let imageId = this.podcastForm.get('image_id').value;
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

  audioValidation(formcontrol: AbstractControl) {
    var fileExtension = formcontrol.value ? formcontrol.value.split('.').pop() : '';

    if(fileExtension && fileExtension !== 'mp3')
    {
      return {'audio': true}
    }

    return null
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

    this.getSportsTagsSub = this.podcastService.get_sports_tags('podcast').subscribe(

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

    data.result.forEach(tag => {

      // element.sports_tags.forEach( tag  => {

        sportsTags.push(tag)

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

  addCustomUser = (term) => ({id: term, name: term});

  onFileChange(event, type: string = '') {

    var fileExtension = event.target.files[0] ? event.target.files[0].name.split('.').pop() : '';

    if(type !== '') {
      if( (event.target.files && event.target.files.length) && (fileExtension === 'mp3') ) {
        const file: File = event.target.files[0];
        this.podcastForm.get('podcast_audio').setValue(file);
      }
    } else {
      if( (event.target.files && event.target.files.length) && (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') ) {
        const file = event.target.files[0];
        this.podcastForm.get('podcast_image').setValue(file);
      }
    }

  }

  onSubmit(podcastData) {
    // Process checkout data here

    this.submitted = true;
    this.serverError = '';

    // stop here if form is invalid
    if (this.podcastForm.invalid) {
        return;
    }

    // console.log('Your podcast has been submitted', podcastData);
    delete podcastData['podcast_file'];
    this.disableBtn = true;
     this.savePodcastSub = this.podcastService.save_podcast(podcastData).subscribe(
      (response: any) => {
        // console.log('resp',response);
        this.submitted = false;
        this.disableBtn = false;
        if(response.meta.code === 200) {
          this.podcastForm.reset();
          this.router.navigate(['admin/podcast-lists']);
        } else {
          this.serverError = response.meta.message;
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
      },
      (err) => {
        this.disableBtn = false;
        if(err.error.message === 'Unauthenticated.') {
          this.authService.logoutEvent.emit(true);
          localStorage.removeItem('data');
          this.serverError = 'Your token has been expired. Please login again.';
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });

          setTimeout(() => {
            this.router.navigate(['admin-auth/login']);
          },1000);
        } else {
            window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
            this.serverError = err.error.message;
        }
      }
      );

  }

   findPodcastById(podcastId) {


      let podcastData = {
        podcast_id: podcastId
      }

      this.findPodcastByIdSub = this.podcastService.find_podcast_by_id(podcastData).subscribe(
        (response:any) => {
          this.loading = false;
          // console.log(response)
          if(response.meta.code === 200 ){
            this.setPodcastFormFields(response.result);
            if(response.result.files && response.result.files.length > 0) {
              this.set_mp3 = response.result.files[0].name;
            }
          } else {
            this.serverError = response.meta.message;

              if('code' in response.result && response.result.code === 999) {
                this.removeBtn = true;
                setTimeout(()=>{ this.router.navigate(['admin/podcast-lists']); },3000);
              }
          }

        },
        (error) => {
          this.loading = false;
          this.serverError = error.statusText;
          this.is_Authenticate(error);
        });
    }


   setPodcastFormFields(data) {


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

    this.podcastForm.patchValue({
      podcast_id: data.id,
      title: data.title,
      content: data.content,
      podcast_sports_tag: sportsTags,
      podcast_meta_tag: metaTags[0] ? metaTags: [{title:'', keyword:'', description:''}],
      image: '',
      podcast_image: '',
      file_path: data['images'][0] ? data['images'][0]['file_path']: '',
      image_id: data['images'][0] ? data['images'][0]['id']: '',
      podcast_url: data.podcast_url ? '/podcast/' + data.podcast_url: '',
      custom_file_url: data.files.length > 0 ? data.files[0]['file_path'] : '',
      embedded_url: data.embedded_url,
      status: data.status ? data.status : 'draft',
      file_title: data['files'][0] ? data['files'][0]['name'] : '',
      file_id: data['files'][0] ? data['files'][0]['id'] : ''
    });

    if(data['images'].length > 0) {
      this.currentImageData = data.images[0];
    }

    this.currentFileData = data['files'][0] ? data['files'][0] : undefined;

   }

   is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }


}
