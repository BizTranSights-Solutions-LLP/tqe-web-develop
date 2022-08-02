import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MediaLibraryService } from '../../../services/media-library.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-media-library',
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.css']
})
export class MediaLibraryComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('gallery') gallery: ModalDirective;
  @ViewChild('file') file: ElementRef;
  @ViewChild('imgTitle') imgTitle: ElementRef;
  @ViewChild('imgCaption') imgCaption: ElementRef;
  @ViewChild('imgAltText') imgAltText: ElementRef;
  @ViewChild('imgDescription') imgDescription: ElementRef;
  @ViewChild('imgTitleU') imgTitleU: ElementRef;
  @ViewChild('imgCaptionU') imgCaptionU: ElementRef;
  @ViewChild('imgAltTextU') imgAltTextU: ElementRef;
  @ViewChild('imgDescriptionU') imgDescriptionU: ElementRef;

  mediaType: string = '';
  associatedMedia: any;
  media:any = [];
  styleForSelectedImage: any = {'border': '2px solid red'};
  libraryImageStyle: any = {};
  activeClass: any = { upload: 'active', gallery: null};
  previousSelectedIndex: number;

  imageLoading: boolean = true;
  reloadMediaLibrary: boolean = false;
  selectImageForEditor: boolean = false;
  editLibraryImage: boolean = false;
  imgUpdateLoader: boolean = false;

  successMsg: string = '';
  errorMsg: string = '';
  imgSuccessMsg: string = '';
  imgErrorMsg: string = '';

  public imagePath;
  imgURL: any;
  currentMediaData: any;
  imgToUpdate: any;
  public message: string;
  loadingPreview: boolean = false;
  uploadingImage: boolean = false;
  paginationImgLoading: boolean = false;
  imageOffset: number = 0;
  uploadResponse = { status: '', message: '', filePath: '' };
  preparingImageGallery: boolean = false;

  AllSubscriptions: Subscription[] = [];
  fileIcon: any = "../../../../../assets/images/ico-audio.png";

  constructor(
    private mlService: MediaLibraryService,
    private router: Router,
    private authService: AuthService,
    private cd: ChangeDetectorRef
    ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.AllSubscriptions.push(
      this.mlService.openML.subscribe(
        (res:any) =>{
          if(res.decide) {
            this.reloadMediaLibrary = res.mediaType !== this.mediaType ? true : false;
            this.mediaType = res.mediaType;
            this.associatedMedia = res.media_data ? res.media_data.id : undefined;
            this.currentMediaData = res.media_data;
            this.gallery.show();

            if(res.for_editor) {
              this.selectImageForEditor = true;
            } else {
              this.selectImageForEditor = false;
            }
          }
        }
      )
    );
  }

  editImageOfLibrary(index: number, image_data: any) {
    
    this.media.map(d => {
      if(d.selected) {
        d.class = '';
      }
      return d;
    });
    // console.log(this.media[index]);
    this.media[index]['class'] = "imgedit";
    this.imgToUpdate = image_data;
    this.editLibraryImage = true;
    let { title, description, alt_text, caption } = image_data;
    setTimeout(()=>{
      this.imgTitleU.nativeElement.value = title ? title : '';
      this.imgAltTextU.nativeElement.value = alt_text ? alt_text : '';
      this.imgCaptionU.nativeElement.value = caption ? caption : '';
      this.imgDescriptionU.nativeElement.value = description ? description : ''; 
    },10);
  }

  updateImgOfLibrary(data: any) {
    let { id } = this.imgToUpdate;
    if(id) {
      let formData = {
        [this.mediaType+'_id']: id,
        [this.mediaType+'_title']: data.title,
        [this.mediaType+'_desc']: data.description,
        alt_text: data.alt_text,
        caption: data.caption,
        auth_code: this.authService.getUserDetail().auth_code
      }
      this.imgUpdateLoader = true;
      this.AllSubscriptions.push(
        this.mlService.update_file(formData, this.mediaType).subscribe(
          (res: any) => {
            this.imgUpdateLoader = false;
            if(res.meta.code === 200) {
              this.imgSuccessMsg = res.meta.message;
              this.imgToUpdate = undefined;
              this.editLibraryImage = false;

              this.media.map((d) => {
                if(d.id === id) {
                  d.title = data.title;
                  d.description = data.description;
                  d.alt_text = data.alt_text;
                  d.caption = data.caption;
                  return d;
                }
                return d;
              });
            } else {
              this.imgUpdateLoader = false;
              this.imgErrorMsg = res.meta.message;
            }

            setTimeout(()=>{ 
              this.imgErrorMsg = '';
              this.imgSuccessMsg = '';
            },2000);
          },
          (err) => {
            this.imgUpdateLoader = false;
            this.imgErrorMsg = 'Server Error';
            setTimeout(()=>{ 
              this.imgErrorMsg = '';
            },2000);
          }
        )
      )
    } else {
      console.log('Nothing to update!');
    }
  }

  selectLibraryImage(index: number, imgData: any) {
    if(!this.selectImageForEditor) {
      this.media.map(d => {
        if(d.selected) {
          d.style = this.libraryImageStyle;
        }
        return d;
      });
      this.media[index]['style'] = this.styleForSelectedImage;
      this.media[index]['selected'] = true;
      this.currentMediaData = imgData;
      this.associatedMedia = imgData.id;
      this.mlService.selectedMedia.emit({
        selected: imgData,
        type: this.mediaType
      });
    } else {
      this.mlService.imageForEditor.emit({
        path: imgData.file_path
      });
      this.gallery.hide();
    }
  }

  download_images() {
    this.activeClass = { upload: 'active', gallery: null};
    if(this.reloadMediaLibrary) {
      this.media = [];
      this.imageLoading = true;
      this.AllSubscriptions.push(this.mlService.get_media(0, this.mediaType).subscribe(
        (res:any) => {
          this.imageLoading = false;
          this.cd.detectChanges();
          if(res.meta.code === 200) {
            let to_splice = -1;
            this.media = res.result[this.mediaType+'_data'].map((d,i) => {
              if(d.id === this.associatedMedia) {
                to_splice = i;
              }else{ 
                d['style'] = this.libraryImageStyle;
                d['class'] = '';
                d['selected'] = false; 
              }
              return d;
            });
            this.imageOffset = 20;

            if(to_splice > -1) {
              // let image_to_append = this.media[to_splice];
              this.media.splice(to_splice, 1);
              // this.media = [image_to_append].concat(this.media);
            }

            if(this.currentMediaData && Object.keys(this.currentMediaData).length > 0) {
              let article_image = this.currentMediaData;
              article_image['style'] = this.styleForSelectedImage;
              article_image['selected'] = true;

              this.media = [article_image].concat(this.media);
            }
            // this.articleService.imageLibrary = this.galleryImages;
          }
        },
        (err) => { 
          this.imageLoading = false;
          console.log(err);
          this.is_Authenticate(err); 
        }
      ));
    } else {
      if(!this.currentMediaData) {
        // if(this.media.length > 0 && 'style' in this.media[0] && 'border' in this.media[0].style) {
        //   console.log(this.media.find)
        //   this.media.splice(0, 1);
        //   console.log('media removed!');
        // }
        this.media.map(d => {
          d['style'] = this.libraryImageStyle; 
          d['class'] = ''; 
          return d;
        })
      } else {
        let to_splice = -1;
        this.media.map((d,i) => {
          if(d.id === this.associatedMedia) {
            to_splice = i;
          }else{ 
            d['style'] = this.libraryImageStyle;
            d['class'] = '';
            d['selected'] = false; 
          }
          return d;
        });
        this.imageOffset = 20;

        if(to_splice > -1) {
          this.media.splice(to_splice, 1);
        }

        if(this.currentMediaData && Object.keys(this.currentMediaData).length > 0) {
          let article_image = this.currentMediaData;
          article_image['style'] = this.styleForSelectedImage;
          article_image['selected'] = true;

          this.media = [article_image].concat(this.media);
        }
      }
    }
  }

  @HostListener("scroll", ["$event"])
  onWindowScroll(event) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      if(!this.paginationImgLoading)
        this.download_images_again();
    }
  }
  
  download_images_again() {
    this.paginationImgLoading = true;
    
    this.AllSubscriptions.push(this.mlService.get_media(this.imageOffset, this.mediaType).subscribe(
      (res:any) => {
        this.paginationImgLoading = false;
        
        if(res.meta.code === 200) {
          let to_splice = -1;
          let more_images = res.result[this.mediaType+'_data'].map((d,i) => {
            if(d.id === this.associatedMedia) {
              to_splice = i;
            }else{ 
              d['style'] = this.libraryImageStyle;
              d['selected'] = false; 
            }
            return d;
          });
          
          this.imageOffset += 20;

          if(to_splice > -1) {
            more_images.splice(to_splice, 1);
          }

          this.media = this.media.concat(more_images);
        }
      },
      (err) => {
        this.paginationImgLoading = false;
        console.log(err);
        this.is_Authenticate(err); 
      }
    ));
  }

  upload(files: any, data: any) {
  
    this.errorMsg = '';
    this.message = '';
    if (files.length === 0)
      return;
    
    if(this.mediaType === 'image') {
      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }
    }

    if(!data.title) {
      this.message = "Title Field is required.";
      return;
    }

    let file = files[0];
    let formData = new FormData();
    formData.append('auth_code', this.authService.getUserDetail().auth_code);
    formData.append(this.mediaType + '_title', data.title);
    formData.append(this.mediaType + '_desc', data.description);
    formData.append('alt_text', data.alt_text);
    formData.append('caption', data.caption);
    formData.append(this.mediaType, file);

    this.uploadingImage = true;
    this.AllSubscriptions.push(this.mlService.upload_file(formData, file, this.mediaType).subscribe((res: any) => {
      this.uploadResponse = res;
      this.cd.detectChanges();
      if(res.status === 'done') {
        let response: any = res.message;
        if(response.meta.code === 200) {
          this.uploadingImage = false;
          this.cd.detectChanges();
          this.file.nativeElement.value = '';
          this.imgURL = '';
          this.cd.detectChanges();
          let media_data = response.result[this.mediaType];
          if(!this.selectImageForEditor) {
            
            this.mlService.selectedMedia.emit({
              selected: media_data,
              type: this.mediaType
            })

            this.media.map(d => {
              if(d.selected) {
                d['style'] = this.libraryImageStyle;
              }
              return d;
            });

            media_data['style'] = this.styleForSelectedImage;
            media_data['selected'] = true;
            this.currentMediaData = media_data;
            this.associatedMedia = media_data.id;

            this.media = [media_data].concat(this.media);
            this.gallery.hide();
          } else {
            this.media = [media_data].concat(this.media);
          }
        } else {
          this.message = response.meta.message;
          this.errorMsg = response.meta.message;
          this.cd.detectChanges();
        }
      }
    },(err) => {
      this.errorMsg = err.statusText;
      this.uploadingImage = false;
      console.log(err);
      this.message = 'Connection Breaks!';
    }));
  }

  resetFile() {
    if(!this.uploadingImage) {
      this.file.nativeElement.value = '';
      this.imgURL = '';
      this.uploadResponse = { status: '', message: '', filePath: '' };
    }
  }

  preview(files) {
    this.message = '';
    if (files.length === 0)
      return;
    
    var mimeType = files[0].type;
    if(this.mediaType === 'image') {     
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        this.file.nativeElement.value = '';
        return;
      }

      this.loadingPreview = true;
      var reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
        this.imgURL = reader.result;
        this.loadingPreview = false; 
        this.cd.detectChanges();
      }
    } else {
      if (mimeType.match(/audio\/*/) == null) {
        this.message = "Only Audio are supported.";
        this.file.nativeElement.value = '';
        return;
      }
      this.imgURL = this.fileIcon;
    }
    
  }

  is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }

  ngOnDestroy() {
    for(let Subscription of this.AllSubscriptions) {
      Subscription.unsubscribe();
    }
  }
}
