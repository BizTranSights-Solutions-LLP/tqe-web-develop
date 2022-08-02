import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { MediaLibraryComponent } from '../../admin-panel/components/shared/media-library/media-library.component';
import { ModalModule } from "ngx-bootstrap";

describe('LayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLayoutComponent, AdminHeaderComponent, MediaLibraryComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, ModalModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
