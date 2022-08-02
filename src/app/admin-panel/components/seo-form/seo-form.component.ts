import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-seo-form',
  templateUrl: './seo-form.component.html',
  styleUrls: ['./seo-form.component.css']
})
export class SeoFormComponent implements OnInit {

  seoForm: FormGroup = new FormGroup({
    page_id: new FormControl(''),
    name: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    keyword: new FormControl('', Validators.required),
    page_url: new FormControl('', Validators.required)
  });

  disableBtn: boolean = false;
  loading: boolean = false;

  successMsg: string = '';
  errorMsg: string = '';
  origin: string = window.location.origin;

  constructor(
    private seoService: SeoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    let id = this.route.snapshot.params['id'];

    if(id) {
      this.seoForm.get('page_id').setValue(id);
      try{
        this.loading = true;
        let response: any = await this.seoService.get_data_for(id).toPromise();
        this.loading = false;
        if(response.meta.code === 200) {
          let { result } = response;
          this.seoForm.patchValue(result);
        } else {
          this.errorMsg = response.meta.message;
        }
      } catch(e) {
        this.loading = false;
        this.errorMsg = e.statusText;
        this.is_Authenticate(e);     
      }
    }
  }

  async onSubmit(form) {

    this.errorMsg = '';
    this.successMsg = '';

    if(this.seoForm.invalid) {
      Object.keys(form).map(d =>{
        this.seoForm.get(d).markAsTouched();
        this.errorMsg = 'Fill all the highlighted fields to continue';
      });
      return;
    }

    // if(form.page_url !== '') {
    //   form.page_url = form.page_url.split(' ').filter(d => d !== '').join('_');
    // }
    
    try{
      this.disableBtn = true;
      let response: any = await this.seoService.save(form).toPromise();
      this.disableBtn = false;
      if(response.meta.code === 200) {
        this.successMsg = response.meta.message;
        setTimeout(()=>{
          this.router.navigate(['admin/seo-list']);
        },2000);
      } else {
        this.errorMsg = response.meta.message;
      }
    } catch(e) {
      this.disableBtn = false;
      this.errorMsg = e.statusText;
      this.is_Authenticate(e);
    }

  }

  is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }

}
