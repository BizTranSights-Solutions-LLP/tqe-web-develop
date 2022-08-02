import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolsServiceService } from '../../services/tools-service.service';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { SeoService } from '../../services/seo.service';

declare var $;
@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit , AfterViewInit, OnDestroy {

  @ViewChild('selectWeek') selectWeek: ElementRef;
  @ViewChild('selectSlate') selectSlate: ElementRef;
  @ViewChild('buildRule') buildRulePopUp: ModalDirective;
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;

  // For hidding NFL DK/FK tools
  isNFL: boolean = false;

  hideOptions: boolean = false;
  hideToolOutlet: boolean = true;

  LoggedIn: boolean = false;
  loader: boolean = false;
  isModalShown = false;

  serverErrors: string = '';
  unAuthorized: string = '';

  posArray = ['','','','','','','active'];
  posIndexes = { QB: 0, RB: 1, WR: 2, TE: 3, FLEX: 4, DST: 5 };
  week: any;
  slates: any;
  tool: any;
  weekDefault = '';
  slateDefault = '';
  player_list_interval:any;

  buildRulesGroups = [];
  buildRulesStacks: any = [{
    id: 1,
    player: [],
    pos: [],
    oppos_pos: [],
    exposure: { min: 0, max: 100 }
  }];
  playersList = [];
  allData: any = {};

  buildRulesStack: any = [{
    id: 1,
    player: [],
    pos: [],
    oppos_pos: [],
    exposure: { min: 0, max: 100 }
  }]

  slatePickedFromCsvSubscription: Subscription;
  playerListFetchedEventSubscription: Subscription;
  openPopupSubscription: Subscription;
  loginEventSubscription: Subscription;
  videoSrc: string = '';

  constructor(
    private router: Router,
    private toolService: ToolsServiceService,
    public renderer: Renderer2,
    private dataService: DataService,
    private authService: AuthService,
    private seoService: SeoService,
    private route: ActivatedRoute
    ) {}

  async ngOnInit() {

    // if((this.router.url).includes('/tool/dkoptimizer/all')) this.navOptions(true);
    if((this.router.url).endsWith('/ng')) this.navOptions(true);
    

    this.tool = this.route.parent.snapshot.params.title;
    console.log("this is the tool comp.ts im looking at, tool is,", this.tool)
    this.toolService.toolName = this.tool;
    console.log(this.tool);

    // Check if NFL DK/FK Optimizer
    if(this.tool == "dkoptimizer" || this.tool == "fdoptimizer") {
      this.isNFL = true;
    }

    try{
      let response: any = await this.toolService.get_salary().toPromise();
      this.toolService.remaining = response.max[0];
      this.toolService.salary.max = response.max[0];
      this.toolService.salary.min = response.min[0];
    }catch(e){}
    $(".stack_range").ionRangeSlider({
      type: 'double',
      grid: false,
      min: 0,
      max: 100,
      from: 0,
      to: 100,
      postfix: ""
    });

    $('.group-range-slider').ionRangeSlider({
      type: 'double',
      grid: false,
      min: 0,
      max: 100,
      from: 0,
      to: 100,
      postfix: "",
      onFinish: this.set_group_exposure.bind(this)
    });

    this.toolService.slatePickedFromCsv.subscribe(
      (data: {week: any, slate: string}) => {
        this.slateDefault = data.slate;
        this.weekDefault = data.week;
        this.toolService.set_week_n_slate({week: data.week ,slate: data.slate});
      }
    );

    this.toolService.setPos.subscribe(
      (pos_name: any) => {
        let pos_index = this.posIndexes[pos_name];
        this.applyClassActive(pos_index);
      }
    )

    // this.playerListFetchedEventSubscription = this.toolService.playerListFetchedEvent.subscribe(
    //   (res:any) => {
    //     if(res.length > 0) {
    //       this.playersList = this.toolService.get_players_name_list(res);
    //       this.toolService.set_players_list(res);
    //       this.toolService.poolLoadedFromOtherComp = true;
    //       console.log('triggered fetch');
    //       setTimeout(() => clearInterval(this.player_list_interval),3000);
    //     }
    //   }
    // );

    this.openPopupSubscription = this.toolService.openPopup.subscribe(
      (res:boolean) => {
        if(res) {
          this.buildRules();
        }
      }
    );
    // console.log(this.route.snapshot);

    this.authService.logginEvent.subscribe(
      async (res) => {
        // console.log('calling');
        if(res) {

          this.unAuthorized = '';
          this.authService.overLay.emit(false);
          this.LoggedIn = true;

          this.loader = true;
          try{
            let result = await Promise.all([
              this.toolService.get_week(this.tool).toPromise(),
              this.toolService.get_slates(this.tool).toPromise()
            ]);

            this.week = result[0];
            this.slates = result[1];

            this.toolService.set_week_n_slate({week: this.week[0], slate: this.slates[0]});
            this.weekDefault = this.week[0];
            this.slateDefault = this.slates[0];
            this.load_stack_n_group_from_storage();
          }catch(e){}

          try{
            let check_tool_access: any = await this.dataService.get_tool(this.tool).toPromise();
            console.log("check_tool_access is :",check_tool_access)
            this.loader = false;
            this.allData = check_tool_access.result;
            if(check_tool_access.meta.code === 200) {
              this.toolService.toolId = this.allData.id;
              let meta_data: any = this.allData.meta_tags;
              let title;
              let description;
              if(meta_data.length > 0) {
                title = meta_data.title;
                description = meta_data.description;
                this.seoService.updateAllTags({type:'tool', title: title, description: description, url: window.location.href, image: this.allData.images.length > 0 ? this.allData.images[0].file_path : '' });
                this.seoService.updateSeoTags(title, description, window.location.href, meta_data.keyword);
              } else {
                title = this.allData.title;
                description = title;
                this.seoService.updateAllTags({type:'tool', title: title, description: description, url: window.location.href, image: this.allData.images.length > 0 ? this.allData.images[0].file_path : '' });
                this.seoService.updateSeoTags(title, description, window.location.href, '');
              }

              if(this.allData.images.length > 0) {
                this.seoService.updateImage(this.allData.images[0].file_path);
              }

              if(check_tool_access.result.is_allowed) {
                this.hideToolOutlet = false;
              }
            }
          } catch(e) {
            this.loader = false;
            if(e.status === 401 || e.error.message === 'Unauthenticated.') {
              this.serverErrors = 'You are UnAuthenticated. Please login again!';
              this.loader = false;
              setTimeout(()=>{
                this.authService.logoutEvent.emit(true);
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate(['/'])
              },1000);
            }
          }
        }
      }
    ).unsubscribe();

    this.LoggedIn = this.authService.isUserLoggedIn();
    if(!this.LoggedIn) {
      this.unAuthorized = 'Please Login To Get Access';
    } else {
      this.loader = true;
      try{
        let result = await Promise.all([
          this.toolService.get_week(this.tool).toPromise(),
          this.toolService.get_slates(this.tool).toPromise()
        ]);

        this.week = result[0];
        this.slates = result[1];

        this.toolService.set_week_n_slate({week: this.week[0], slate: this.slates[0]});
        this.weekDefault = this.week[0];
        this.slateDefault = this.slates[0];
        this.load_stack_n_group_from_storage();
      }catch(e){}

      try{
        let check_tool_access: any = await this.dataService.get_tool(this.tool).toPromise();
        this.loader = false;
        this.allData = check_tool_access.result;
        if(check_tool_access.meta.code === 200) {
          this.toolService.toolId = this.allData.id;
          let meta_data: any = this.allData.meta_tags;
          let title;
          let description;
          if(meta_data.length > 0) {
            title = meta_data.title;
            description = meta_data.description;
            this.seoService.updateAllTags({type:'tool', title: title, description: description, url: window.location.href, image: this.allData.images.length > 0 ? this.allData.images[0].file_path : '' });
            this.seoService.updateSeoTags(title, description, window.location.href, meta_data.keyword);
          } else {
            title = this.allData.title;
            description = title;
            this.seoService.updateAllTags({type:'tool', title: title, description: description, url: window.location.href, image: this.allData.images.length > 0 ? this.allData.images[0].file_path : '' });
            this.seoService.updateSeoTags(title, description, window.location.href, '');
          }

          if(this.allData.images.length > 0) {
            this.seoService.updateImage(this.allData.images[0].file_path);
          }

          if(check_tool_access.result.is_allowed) {
            this.hideToolOutlet = false;
          }
        }
      } catch(e) {
        this.loader = false;
        if(e.status === 401 || e.error.message === 'Unauthenticated.') {
          this.serverErrors = 'You are UnAuthenticated. Please login again!';
          this.loader = false;
          setTimeout(()=>{
            this.authService.logoutEvent.emit(true);
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/'])
          },1000);
        }
      }

      // let stored_slate = localStorage.getItem('slate');
      let stored_slate = localStorage.getItem(this.toolService.toolName + ' slate');
      if(stored_slate) {
        this.slateDefault = stored_slate;
        this.toolService.weekNSlate.slate = stored_slate;
      }

      let stored_pos = localStorage.getItem(this.toolService.toolName + ' ' + this.toolService.weekNSlate.slate+ ' pos');
      if(stored_pos && stored_pos !== 'ALL') {
          this.toolService.currentSelectedPos = stored_pos;
          let pos_index = this.posIndexes[stored_pos];
          this.applyClassActive(pos_index);
      }

      // this.toolService.set_week_n_slate({week:this.weekDefault,slate:this.slateDefault});
      // this.toolService.weekNSlateValues.emit({week:16,slate:'Main Slate',first_emit:true});
    }
  }

  showOverlay() {
    this.authService.overLay.emit(true);
  }

  showModal(src): void {
    this.isModalShown = true;
    this.videoSrc = src;
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  load_stack_n_group_from_storage() {

    let { slate } = this.toolService.weekNSlate;
    // console.log(slate);
    let groups: any = localStorage.getItem(this.toolService.toolName + ' '+ slate+' groups');
    // let groups: any = localStorage.getItem(slate+' groups');
    let stacks: any = localStorage.getItem(this.toolService.toolName + ' '+ slate+' stacks');
    // let stacks: any = localStorage.getItem(slate+' stacks');

    if(stacks) {
      let new_stacks = JSON.parse(stacks);
      this.buildRulesStacks = new_stacks;
      this.toolService.savedStackRules = this.buildRulesStacks;
    }
    if(groups) {
      let new_groups = JSON.parse(groups);
      this.buildRulesGroups = new_groups;
      this.toolService.savedGroups = this.buildRulesGroups;
    }
  }

  setup_range_sliders() {

    $(".stack_range").ionRangeSlider({
      type: 'double',
      grid: false,
      min: 0,
      max: 100,
      from: 0,
      to: 100,
      postfix: ""
    });

    $('.group-range-slider').ionRangeSlider({
      type: 'double',
      grid: false,
      min: 0,
      max: 100,
      from: 0,
      to: 100,
      postfix: "",
      onFinish: this.set_group_exposure.bind(this)
    });

    let { slate } = this.toolService.weekNSlate;
    // console.log(slate);
    let groups: any = localStorage.getItem(this.toolService.toolName + ' '+ slate+' groups');
    // let groups: any = localStorage.getItem(slate+' groups');
    let stacks: any = localStorage.getItem(this.toolService.toolName + ' '+ slate+' stacks');
    // let stacks: any = localStorage.getItem(slate+' stacks');

    if(stacks) {
      stacks = JSON.parse(stacks);

      if(stacks.length > 0) {
        stacks.map(
          s => {
            let slider = $(`.ss-${s.id}`).data('ionRangeSlider');
            slider.update({
              from: parseInt(s.exposure.min),
              to: parseInt(s.exposure.max)
            });
          }
        );
      }
    }

    if(groups) {
      groups = JSON.parse(groups);
      if(groups.length > 0) {
        groups.map(g => {
            let selecter = `.gs-${g.name}`;
            let slider = $(selecter).data('ionRangeSlider');
            slider.update({
              from: parseInt(g.range.min),
              to: parseInt(g.range.max)
            });
        });
      }
    }
  }

  buildRules() {
    this.toolService.popupEvent.emit(true);

    if(this.toolService.get_players_name_list().length === 0) {
      this.player_list_interval = setInterval(()=>{
        console.log('fetching............')
        if(this.toolService.get_players_name_list().length !== 0) {
          this.playersList = this.toolService.get_players_name_list();
          // let stack_rules:any = this.toolService.savedStackRules;
          // if(Object.keys(stack_rules).length > 0) {
          //     this.buildRulesStack = stack_rules;
          //     let proj_instance = $('.stack_range').data('ionRangeSlider');
          //     proj_instance.update({
          //         from: stack_rules.exposure.min,
          //         to: stack_rules.exposure.max
          //     });
          // }
          clearInterval(this.player_list_interval);
        }
      },1000);
    } else {
      this.playersList = this.toolService.get_players_name_list();
      // let stack_rules:any = this.toolService.savedStackRules;
      // if(Object.keys(stack_rules).length > 0) {
      //     this.buildRulesStack = stack_rules;
      //     let proj_instance = $('.stack_range').data('ionRangeSlider');
      //     proj_instance.update({
      //         from: stack_rules.exposure.min,
      //         to: stack_rules.exposure.max
      //     });
      //   }
    }

    this.buildRulePopUp.show();

    // $(".js-range-slider_4").ionRangeSlider({
    //   type: "double",
    //   grid: false,
    //   min: 0,
    //   postfix: ""
    // });
  }

  createNewStack() {
    let stack = {
      id: Date.now(),
      player: [],
      pos: [],
      oppos_pos: [],
      exposure: { min: 0, max: 100 }
    }
    this.buildRulesStacks.push(stack);
    setTimeout(()=>{
      $(".stack_range").ionRangeSlider({
        type: "double",
        grid: false,
        min: 0,
        max: 100,
        postfix: "",
        // onFinish: this.set_group_exposure.bind(this)
      });
    },10);

    let { slate } = this.toolService.weekNSlate;
    localStorage.setItem(this.toolService.toolName + ' '+ slate + ' stacks', JSON.stringify(this.buildRulesStacks));
    // localStorage.setItem(slate + ' stacks', JSON.stringify(this.buildRulesStacks));
  }

  deleteBuildRuleStack(id) {
    this.buildRulesStacks = this.buildRulesStacks.filter(d => d.id !== id);
    if(this.buildRulesStacks.length > 0) {
      $('.sl-1').addClass('active');
      $('.sv-1').addClass('active show');
    }
    let { slate } = this.toolService.weekNSlate;
    localStorage.setItem(this.toolService.toolName + ' '+ slate + ' stacks', JSON.stringify(this.buildRulesStacks));
    // localStorage.setItem(slate + ' stacks', JSON.stringify(this.buildRulesStacks));
    this.toolService.savedStackRules = this.buildRulesStacks;
  }

  addStackRules(id: any) {

    let checks = {
      name: false,
      pos: false,
      oppos_pos: false
    }

    let player_name = [];
    $('.stack_name_'+ id +' tag').each((index,value) => {
      let chip_value = value.innerText.replace(/\s+/g,'');
      if(chip_value) {
        if(player_name.indexOf(chip_value) === -1) {
          player_name.push(value.innerText);
        }
      }
    });

    if(player_name.length > 0) {
      checks.name = true;
      this.buildRulesStacks.map(
        d => {
          if(d.id == id) {
            d.player = player_name;
            return d;
          }
          return d;
        }
      );
    }

    let pos_array = [];
    $('.brs-pos_'+ id +' tag').each((index,value) => {
        let chip_value = value.innerText.replace(/\s+/g,'');
        if(chip_value) {
            if(pos_array.indexOf(chip_value) === -1) {
                pos_array.push(chip_value);
            }
        }
    });

    if(pos_array.length > 0) {
      checks.pos = true;
      this.buildRulesStacks.map(
        d => {
          if(d.id == id) {
            d.pos = pos_array;
            return d;
          }
          return d;
        }
      );
    }

    let oppos_pos = [];
    $('.brs-oppos_pos_'+id+' tag').each((index,value) => {
        let chip_value = value.innerText.replace(/\s+/g,'');
        if(chip_value) {
            if(oppos_pos.indexOf(chip_value) === -1) {
                oppos_pos.push(chip_value);
            }
        }
    });

    if(oppos_pos.length > 0) {
      checks.oppos_pos = true;
      this.buildRulesStacks.map(
        d => {
          if(d.id == id) {
            d.oppos_pos = oppos_pos;
            return d;
          }
          return d;
        }
      );
    }

    let stack_range = $('.ss-'+id)[0].value;
    let min = stack_range.split(';')[0];
    let max = stack_range.split(';')[1];

    this.buildRulesStacks.map(d => {
      if(d.id == id) {
        d.exposure.min = min;
        d.exposure.max = max;
        return d;
      }
      return d;
    });

    let { slate } = this.toolService.weekNSlate;
    localStorage.setItem(this.toolService.toolName + ' '+ slate + ' stacks', JSON.stringify(this.buildRulesStacks));
    // localStorage.setItem(slate + ' stacks', JSON.stringify(this.buildRulesStacks));
    this.toolService.savedStackRules = this.buildRulesStacks;

    if(checks.name && (checks.pos || checks.oppos_pos)) {
      $('.alert-'+id).show();
      setTimeout(() => {
        $('.alert-'+id).hide();
      }, 2000);
    } else {
      $('.error-alert-'+id).show();
      setTimeout(() => {
        $('.error-alert-'+id).hide();
      }, 5000);
    }
    // console.log(this.buildRulesStacks);

    // this.buildRulesStack.pos = [];
    // this.buildRulesStack.oppos_pos = [];
    // console.log(this.buildRulesStack)
  }

  resetStack(stack_id) {
    let stack_range = $('.ss-'+stack_id).data('ionRangeSlider');
    stack_range.update({
      from: 0,
      to: 100
    });

    this.buildRulesStacks.map(
      data => {
        if(data.id === stack_id) {
          data.exposure.min = 0;
          data.exposure.max = 100;
          data.player = [];
          data.pos = [];
          data.oppos_pos = [];
          return data;
        }
        return data;
      }
    );

    this.toolService.savedStackRules = this.buildRulesStacks;
    let { slate } = this.toolService.weekNSlate;
    localStorage.setItem(this.toolService.toolName + ' '+ slate + ' stacks', JSON.stringify(this.buildRulesStacks));
    // localStorage.setItem(slate + ' stacks', JSON.stringify(this.buildRulesStacks));
  }

  openPlayerPool() {
    this.buildRulePopUp.hide();
    this.toolService.openPlayerPool.emit(true);
    this.router.navigate(['tools']);
  }

  emitEvent() {
    this.toolService.popupEvent.emit(true);
  }

  createNewGroup() {
    let group = {
      name: Date.now(),
      selected_players: [],
      selected_players_id: [],
      range: {
        min: 0,
        max: 100
      }
    }
    this.buildRulesGroups.push(group);
    setTimeout(()=>{
      // $('.stack_of').tagsinput('refresh');
      $(".js-range-slider").ionRangeSlider({
        type: "double",
        grid: false,
        min: 0,
        postfix: "",
        onFinish: this.set_group_exposure.bind(this)
      });
    },10);

    this.toolService.savedGroups = this.buildRulesGroups;
    let { slate } = this.toolService.weekNSlate;
    localStorage.setItem(this.toolService.toolName + ' '+ slate + ' groups', JSON.stringify(this.buildRulesGroups));
    // localStorage.setItem(slate + ' groups', JSON.stringify(this.buildRulesGroups));
  }

  updateGroupPlayers(event, action, id) {

    if(action === 'add') {
      this.buildRulesGroups.map(
        (d) => {
          if(d.name === id) {
            d.selected_players.push(event.group_player);
            d.selected_players_id.push(event.id);
          }
        }
      );

      $('.alert-'+id).show();
      setTimeout(() => {
        $('.alert-'+id).hide();
      }, 3000);
    } else if(action === 'remove') {
      let group = this.buildRulesGroups.find(g => g.name == id);
      let group_index = this.buildRulesGroups.findIndex(g => g.name == id);
      if(group) {
        if(event.group_player) {
          let group_player_index = group.selected_players.findIndex(d => d === event.group_player);
          if(group_player_index > -1) {
            this.buildRulesGroups[group_index].selected_players.splice(group_player_index,1);
          }
          let group_player_id_index = group.selected_players_id.findIndex(d => d == event.id);
          if(group_player_id_index > -1) {
            this.buildRulesGroups[group_index].selected_players_id.splice(group_player_id_index,1);
          }
        } else {
          let group_player_index = group.selected_players.findIndex(d => d === event);
          if(group_player_index > -1) {
            this.buildRulesGroups[group_index].selected_players.splice(group_player_index,1);
            this.buildRulesGroups[group_index].selected_players_id.splice(group_player_index,1);
          }
        }
      }

      $('.error-alert-'+id).show();
      setTimeout(() => {
        $('.error-alert-'+id).hide();
      }, 3000);
    }

    this.toolService.savedGroups = this.buildRulesGroups;
    let { slate } = this.toolService.weekNSlate;
    localStorage.setItem(this.toolService.toolName + ' '+ slate + ' groups', JSON.stringify(this.buildRulesGroups));
    // localStorage.setItem(slate + ' groups', JSON.stringify(this.buildRulesGroups));
    // console.log(this.buildRulesGroups);
  }

  set_group_exposure(data) {
    let slider_classes = data.input[0].className.split(' ');

    let check = slider_classes.find(c => c.startsWith('gs-'))
    let slider_class = check ? check : '';

    if(slider_class) {
      let id = check.split('-')[1];
      let range = $('.'+slider_class)[0].value;
      let min = range.split(';')[0];
      let max = range.split(';')[1];
      this.buildRulesGroups.map(
        (d) =>  {
        if(d.name == id) {
          d.range.min = min;
          d.range.max = max;

          $('.alert-'+id).show();
          setTimeout(() => {
            $('.alert-'+id).hide();
          }, 3000);
        }
      });

      this.toolService.savedGroups = this.buildRulesGroups;
      let { slate } = this.toolService.weekNSlate;
      localStorage.setItem(this.toolService.toolName + ' '+ slate + ' groups', JSON.stringify(this.buildRulesGroups));
      // localStorage.setItem(slate + ' groups', JSON.stringify(this.buildRulesGroups));
    }

  }

  deleteBuildRuleGroup(index) {
    this.buildRulesGroups.splice(index,1);
    let id = this.buildRulesGroups[0] ? this.buildRulesGroups[0].name : '';
    if(this.buildRulesGroups.length > 0) {
      $('.gl-'+id).addClass('active');
      $('.gv-'+id).addClass('active show');
    }
    this.toolService.savedGroups = this.buildRulesGroups;
    let { slate } = this.toolService.weekNSlate;
    localStorage.setItem(this.toolService.toolName + ' '+ slate + ' groups', JSON.stringify(this.buildRulesGroups));
    // localStorage.setItem(slate + ' groups', JSON.stringify(this.buildRulesGroups));
  }

  deleteAllGroups() {
    if(this.buildRulesGroups.length > 0) {
      this.buildRulesGroups = [];
    }
    this.toolService.savedGroups = this.buildRulesGroups;
    let { slate } = this.toolService.weekNSlate;
    localStorage.removeItem(this.toolService.toolName + ' '+ slate + ' groups');
  }

  emitWeekNSlateVals(week,slate) {

    localStorage.setItem(this.toolService.toolName + ' slate', slate);
    // localStorage.setItem('slate', slate);

    this.weekDefault = week;
    this.slateDefault = slate;
    this.toolService.set_week_n_slate({week,slate});
    this.toolService.weekNSlateValues.emit({week,slate});

    let groups: any = localStorage.getItem(this.toolService.toolName + ' '+ slate+' groups');
    // let groups: any = localStorage.getItem(slate+' groups');
    let stacks: any = localStorage.getItem(this.toolService.toolName + ' '+ slate+' stacks');
    // let stacks: any = localStorage.getItem(slate+' stacks');

    if(stacks) {
      let new_stacks = JSON.parse(stacks);
      this.buildRulesStacks = new_stacks;
      this.toolService.savedStackRules = this.buildRulesStacks;

      setTimeout(() => {
        $(".stack_range").ionRangeSlider({
          type: 'double',
          grid: false,
          min: 0,
          max: 100,
          from: 0,
          to: 100,
          postfix: ""
        });
      },100);
    } else {
      this.buildRulesStacks = this.buildRulesStack;
      this.toolService.savedStackRules = this.buildRulesStacks;

      setTimeout(() => {
        $(".stack_range").ionRangeSlider({
          type: 'double',
          grid: false,
          min: 0,
          max: 100,
          from: 0,
          to: 100,
          postfix: ""
        });
      },100);
    }

    if(groups) {
      let new_groups = JSON.parse(groups);
      this.buildRulesGroups = new_groups;
      this.toolService.savedGroups = this.buildRulesGroups;

      setTimeout(() => {
        $('.group-range-slider').ionRangeSlider({
          type: 'double',
          grid: false,
          min: 0,
          max: 100,
          from: 0,
          to: 100,
          postfix: "",
          onFinish: this.set_group_exposure.bind(this)
        });
      },100);
    } else {
      this.buildRulesGroups = [];
      this.toolService.savedGroups = this.buildRulesGroups;
    }

  }

  selectPos(pos,pos_name) {
    this.applyClassActive(pos);
    this.toolService.set_current_selected_pos(pos_name);

    this.toolService.posFilterTrigger.emit(pos_name);
  }

  clearExposure() {
    this.toolService.clearExposure.emit(true);
  }

  resetAll() {
    this.applyClassActive(this.posArray.length-1);
    this.toolService.set_current_selected_pos('ALL');
    this.toolService.resetAll.emit(true);
    this.buildRulesStacks = this.buildRulesStack;
    this.buildRulesGroups = [];
    setTimeout(()=>{
      $(".stack_range").ionRangeSlider({
        type: 'double',
        grid: false,
        min: 0,
        max: 100,
        from: 0,
        to: 100,
        postfix: ""
      });
    },100);
    let { slate } = this.toolService.weekNSlate;
    localStorage.removeItem(this.toolService.toolName + ' '+ slate+' groups');
    localStorage.removeItem(this.toolService.toolName + ' '+ slate+' stacks');
  }

  excludeAll() {
    this.toolService.excludeAll.emit(true);
  }

  navOptions(decide) {
    if(decide) {
      this.hideOptions = decide;
    }else{
      this.hideOptions = decide;
    }
  }

  applyClassActive(pos) {
    this.posArray.forEach((element, index) => {
      if(pos === index) {
        this.posArray[pos] = 'active';
      } else {
        this.posArray[index] = '';
      }
    });
  }

  clear_interval() {
    clearInterval(this.player_list_interval);
  }

  // Helps to load the tool and resolve the issue to load data of previous tool
  reset_all() {
      this.toolService.clear_exclude_array();
      this.toolService.reset_player_n_exlude_arr();
      this.toolService.set_players_list([]);
      this.toolService.preserve_lineup([], [], 0, 0, 0, 0);
      this.toolService.currentSelectedPos = 'ALL';
      this.toolService.mylineupsData = {};
  }

  ngOnDestroy() {
    this.reset_all();
    if(this.slatePickedFromCsvSubscription ) { this.slatePickedFromCsvSubscription.unsubscribe(); }
    if(this.playerListFetchedEventSubscription) { this.playerListFetchedEventSubscription.unsubscribe(); }
    if(this.openPopupSubscription) { this.openPopupSubscription.unsubscribe(); }
    if(localStorage.getItem(this.toolService.toolName + ' '+ 'my_lineups')) { localStorage.removeItem(this.toolService.toolName + ' '+ 'my_lineups'); }
  }
}
