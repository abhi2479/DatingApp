import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.css']
})
export class MemberListsComponent implements OnInit {
  //members$ : Observable<Member[]> | undefined;
  members:Member[]=[];
  pagination : Pagination | undefined;
  userParams : UserParams | undefined;
  user : User | undefined;
  genderList = [{value:'male',display :'Males'},{value:'female',display:'Females'}]

  constructor(private memberService: MembersService,private accountService : AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next:user => {
          if(user){
            this.userParams = new UserParams(user);
            this.user=user;
          }
        }
      })
   }

  ngOnInit(): void {
    // this.loadMembers();
    //this.members$=this.memberService.getMembers();
    this.loadMembers();
  }

  loadMembers(){
    if(!this.userParams) return;
    this.memberService.getMembers(this.userParams).subscribe({
      next:response=>{
        if(response.result && response.pagination){
          this.members=response.result;
          this.pagination=response.pagination;
        }
      }
    })
  }

  resetFilters(){
    if(this.user){
      this.userParams=new UserParams(this.user);
      this.loadMembers();
    }
  }

  // loadMembers(){
  //   this.memberService.getMembers().subscribe({
  //     next: members=>this.members=members
  //   })
  //}

pageChanged(event : any)
{
  if(this.userParams && this.userParams?.pageNumber!== event.page)
  {
    this.userParams.pageNumber=event.page;
    this.loadMembers();
  }
  
}


}
