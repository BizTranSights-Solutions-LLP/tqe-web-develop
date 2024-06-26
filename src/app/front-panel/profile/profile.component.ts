import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../services/data.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MembershipService} from '../../services/membership.service';
import {SeoService} from '../../services/seo.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

class ImageSnippet {
  pending = false;
  status = 'init';

  constructor(public src: string, public file: File) {
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('tourGuide') tourGuide: ModalDirective;

  selectedFile: ImageSnippet;
  file: File;
  userData: any = [];

  loader = true;
  user_subscriptionLoader = false;
  profile_picture_holder = false;
  upload_picture_modal = false;
  uploading = false;

  serverErrors = '';
  imageServerErrors = '';
  selectedMemberShipId: number;
  selectedMemberShipName = '';
  image_size_exceed_error = '';

  user_subscription: Subscription;


  // where did you know us
  wheres: string[] = [
    'I will re-subscribe next season',
    'Price too expensive',
    'I need something different',
    'I need something more',
    'Other'
  ];
  where = '';
  other = '';


  // tslint:disable-next-line:max-line-length
  constructor(private dataService: DataService, private authService: AuthService, private router: Router, private membershipService: MembershipService, private seoService: SeoService) {
  }


  ngOnInit() {
    this.seoService.updateTitle('My Profile | The Quant Edge | Sports Betting Tools and Optimizers');
    this.user_subscription = this.authService.logginEvent.subscribe(
      res => {
        if (res) {
          this.get_user_data();
        }
      }
    );
    this.get_user_data();
  }


  showModal(id: number, name: string) {
    this.selectedMemberShipId = id;
    this.selectedMemberShipName = name;
    this.tourGuide.show();
  }

  hideModal() {
    this.tourGuide.hide();
  }

  unsubscribe(id: number) {
    const form = {
      reason: this.where,
      detail: this.other
    };
    console.log(form);


    // cancel membership
    this.membershipService.set_cancellation_reasons(form).subscribe(
      (res: any) => {
        // console.log("reason!!!", res.meta.code);
      }
    );




    this.user_subscriptionLoader = true;
    this.membershipService.unsubscribeMembershipPackage(id).subscribe(
      (res: any) => {

        // console.log("cancel!!!  ", res.meta.code);

        if (res.meta.code === 200) {
          const index = this.userData.memberships_users.findIndex((d: any) => d.id === id);
          if (index > -1) {
            this.userData.memberships_users.splice(index, 1);
            this.tourGuide.hide();
            this.user_subscriptionLoader = false;
          }
        } else if (res.meta.code === 400 || res.meta.message === 'No membership found.') {
          this.tourGuide.hide();
        }
      }
    );
  }

  async get_user_data() {

    let data: any;
    try {
      data = await this.dataService.get_user_information().toPromise();
      this.serverErrors = '';
      this.userData = data.result;
      this.loader = false;
    } catch (e) {
      if (e.status === 401 || e.error.message === 'Unauthenticated.') {
        this.serverErrors = 'You are UnAuthenticated. Please login again!';
        this.loader = false;
        setTimeout(() => {
          this.authService.logoutEvent.emit(true);
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/']);
        }, 1000);
      }
    }
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
    this.selectedFile.src = '';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.uploading = false;
  }

  processFile(imageInput: any) {
    this.profile_picture_holder = true;
    this.file = imageInput.files[0];
    this.imageServerErrors = '';
    // console.log(imageInput);
    const reader = new FileReader();
    // log / access file size in bytes
    // console.log(imageInput.files[0].size + ' Bytes');

    // log / access file size in Mb
    // console.log(imageInput.files[0].size/1024/1024 + ' MB');
    if (imageInput.files[0].size / 1024 / 1024 > 5) {
      // console.log('file is bigger than 1MB');
      this.image_size_exceed_error = 'exceed';
      this.selectedFile.status = '';
    } else {
      reader.addEventListener('load', (e: any) => {
        this.selectedFile = new ImageSnippet(e.target.result, this.file);
        this.selectedFile.pending = true;
        this.selectedFile.status = 'ok';
        this.image_size_exceed_error = '';
      });
    }


    reader.readAsDataURL(this.file);
  }

  uploadPhoto() {
    this.uploading = true;
    this.imageServerErrors = '';
    this.authService.update_profile_image(this.file).subscribe(
      (res: any) => {
        console.log(res);
        if (res.meta.code === 400) {
          this.profile_picture_holder = false;
          this.uploading = false;
          this.imageServerErrors = res.meta.message;
        } else if (res.meta.code === 200) {
          this.onSuccess();
          this.userData.photo = res.result.file_path;
          this.profile_picture_holder = false;
          this.uploading = false;
          this.imageServerErrors = '';
          this.upload_picture_modal = false;

        }

      },
      (err) => {
        this.onError();
      }
    );
  }

  update_profile_picture() {
    if (!this.upload_picture_modal) {
      this.upload_picture_modal = true;
    } else {
      this.upload_picture_modal = false;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.user_subscription) {
      this.user_subscription.unsubscribe();
    }
  }
}
