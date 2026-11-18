import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { chat_messages } from '../chat_message_interface';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as _ from 'lodash';
import { AuthService } from 'src/app/auth/auth.service';
import { PlanService } from 'src/app/services/plan.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent
  implements OnInit, AfterContentChecked, AfterViewInit
{
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  message: any[] = [];
  offset: number = 0; // Current offset
  limit: number = 10;
  establishConnection: any = {
    sender_id: '',
    receiver_id: '',
    sender_img: '',
    reciver_name: '',
    sender_name: '',
    reciver_img: '',
  };
  imgURL: string = 'http://localhost/matrimonial/storage/';
  messageCreationForm = new FormGroup({
    message_content: new FormControl('', [Validators.required]),
    receiver_id: new FormControl('', [Validators.required]),
    sender_id: new FormControl('', [Validators.required]),
    chat_room_id: new FormControl('', [Validators.required]),
    created_At: new FormControl(moment().toISOString(), [Validators.required]),
  });

  staticMessageData: any[] = [];
  containerHeight: number;
  show: boolean = false;
  online: boolean = false;
  messagesLoader: boolean = false;
  isFetchingMessages: boolean = false;
  totalMessageAvailble: number = 0;
  chat_rome_id: string;
  constructor(
    private _rout: ActivatedRoute,
    private appServices: AppService,
    private apiParameterScript: ApiParameterScript,
    private el: ElementRef,
    private renderer: Renderer2,
    private AUTH: AuthService,
    private plan: PlanService,
    private commonService: CommonService
  ) {}

  ngAfterViewInit() {
    this.chatContainer.nativeElement.addEventListener(
      'scroll',
      this.handleScroll.bind(this)
    );
  }

  handleScroll(event: Event): void {
    const container = event.target as HTMLElement;
    // Check if the user has scrolled to the top
    if (
      container.scrollTop === 0 &&
      !this.isFetchingMessages &&
      this.totalMessageAvailble > this.offset
    ) {
      this.offset = this.message.length;
      this.fetchOlderMessages();
    }
  }
  fetchOlderMessages() {
    console.log('Getting Older Message');
    this.loadingChat(false);
  }
  ngAfterContentChecked(): void {
    if (this.chatContainer && this.chatContainer.nativeElement) {
    }
  }
  isChatBoxFocused(): boolean {
    // Check if the chat box or any of its child elements have focus
    return this.chatContainer.nativeElement.contains(document.activeElement);
  }
  ngOnInit(): void {


    this.AUTH.setupPermissionForViewProfile().subscribe();
    this._rout.params.subscribe((connection_params: any) => {
      this.chat_rome_id = connection_params.chat_rome_id;
      this.intiatingConnection(connection_params.chat_rome_id);
    });
    this.loadMessages();
  }

  loadMessages() {
    this.messagesLoader = true;
    this.apiParameterScript
      .fetchdata('message', {
        projection: ['*'],
        whereConditions: { status: 1 },
      })
      .subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          this.messagesLoader = false;
          this.staticMessageData = _.map(res['data']);
          // this.scrollToBottom();
        }
      });
  }
  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = this.chatContainer.nativeElement;
      const lastMessage = chatContainer.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    }, 200);
  }
  send() {
    console.log(this.messageCreationForm);
    console.log(this.chatContainer.nativeElement);
    console.log(this.chatContainer.nativeElement.scrollHeight);
    this.message.push(this.messageCreationForm.value);
    if (this.messageCreationForm.valid) {
      var saveData = {
        data: this.messageCreationForm.value,
      };
      this.apiParameterScript
        .savedata('chat_messages', saveData)
        .subscribe((res: any) => {
          if (res.success) {
            this.scrollToBottom();
            this.plan.managementSendMessageCount();
            this.commonService.createNotification(
              this.messageCreationForm.value,
              'SEND_MESSAGE_NOTIFICATION_OPERATION',
              this.messageCreationForm.value.message_content
            );
            this.messageCreationForm.controls.message_content.reset();
          }
        });
    } else {
      Swal.fire('Please Write Somethings', '', 'warning');
    }
  }

  intiatingConnection(connection_id: string) {
    let apiFetchDat = {
      projection: ['*'],
      whereConditions: { connection_id: connection_id },
    };
    this.blockUI.start('Loading Messages...');
    this.apiParameterScript
      .fetchdata('chat_connection_details', apiFetchDat)
      .subscribe((chat_connection_res: any) => {
        if (
          chat_connection_res.success &&
          chat_connection_res['data'].length > 0
        ) {
          console.log(chat_connection_res);

          this.messageCreationForm.setValue({
            message_content: null,
            receiver_id:
              this.appServices.authStatus.profile_id ==
              chat_connection_res['data'][0].requested_by
                ? chat_connection_res['data'][0].requested_to
                : chat_connection_res['data'][0].requested_by,
            sender_id: this.appServices.authStatus.profile_id,
            chat_room_id: connection_id,
            created_At: moment().toISOString(),
          });
          this.loadingChat();
          let query = `SELECT user_profile_image,user_id,user_fname,user_lname FROM user_info WHERE user_id IN ('${chat_connection_res['data'][0].requested_by}','${chat_connection_res['data'][0].requested_to}')`;
          this.apiParameterScript
            .fetchDataFormQuery(query)
            .subscribe((res: any) => {
              if (res.success && res['data'].length > 0) {
                res['data'].forEach((profile: any) => {
                  if (
                    profile.user_id == this.appServices.authStatus.profile_id
                  ) {
                    this.establishConnection.sender_img =
                      this.appServices.getFilePath() +
                      profile.user_profile_image;
                    this.establishConnection.sender_name =
                      profile.user_fname + ' ' + profile.user_lname;
                    this.establishConnection.sender_id =
                      this.appServices.authStatus.profile_id;
                      console.log(this.establishConnection);
                      console.log(this.establishConnection.receiver_id);
                      this.apiParameterScript
                      .fetchdata('user_info', {
                        projection: ['online_status'],
                        whereConditions: {
                          user_id: this.establishConnection.receiver_id,
                        },
                      })
                      .subscribe((res1: any) => {
                        console.log(res1);
                        if (res1.success && res1['data'].length > 0) {
                          if (res1['data'][0].online_status == 1) {
                            console.log(res1['data'][0].online_status);
                            this.show = true;
                            this.online = true;
                          } else {
                            this.show = true;
                            this.online = false;
                          }
                        }
                      });
                  } else {
                    this.establishConnection.reciver_img =
                      this.appServices.getFilePath() +
                      profile.user_profile_image;
                    this.establishConnection.reciver_name =
                      profile.user_fname + ' ' + profile.user_lname;
                    this.establishConnection.receiver_id = profile.user_id;
                    this.apiParameterScript
                      .fetchdata('user_info', {
                        projection: ['online_status'],
                        whereConditions: {
                          user_id: chat_connection_res['data'][0].requested_to,
                        },
                      })
                      .subscribe((res: any) => {
                        if (res.success && res['data'].length > 0) {
                          if (res['data'][0].online_status == 1) {
                            console.log(res['data'][0].online_status);
                            this.show = true;
                            this.online = true;
                          } else {
                            this.show = true;
                            this.online = false;
                          }
                        }
                      });
                  }
                });
              }
            });
        } else {
          this.blockUI.stop();
          Swal.fire('Connection To Server Is failed', 'Unauthorize', 'error');
        }
      });
  }

  loadingChat(gotoButtom: boolean = true) {
    this.apiParameterScript
      .fetchdata(
        'chat_messages',
        {
          projection: ['*'],
          whereConditions: { chat_room_id: this.chat_rome_id },
        },
        this.offset,
        this.limit,
        'message_id'
      )
      .subscribe((messageRes: any) => {
        console.log('Message Histroy', messageRes);
        this.blockUI.stop();
        if (messageRes.success && messageRes['data'].length > 0) {
          this.totalMessageAvailble = messageRes['totalCount'];
          let newMessage = _.reverse(messageRes['data']);
          this.message = this.message.concat(newMessage);
          if (gotoButtom) this.scrollToBottom();
        }
      });
  }
  trackByFn(index: number, message: any): string {
    // console.log("hhii",message);

    return message.message_id; // Use a unique identifier if available
  }
  refresh() {
    // this.loadingChat()
  }
}
