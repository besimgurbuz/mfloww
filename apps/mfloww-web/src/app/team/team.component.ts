import { Component, inject } from '@angular/core';
import { Icon } from '@mfloww/view';
import { ContributorsService } from './services/contributors.service';

type Member = {
  fullname: string;
  title: string;
  photoUrl: string;
  links: SocialMediaProfile[];
};

type SocialMediaProfile = {
  icon: Icon;
  href: string;
};

@Component({
  selector: 'mfloww-team',
  templateUrl: './team.component.html',
})
export class TeamComponent {
  members: Member[] = [
    {
      fullname: 'Besim Gürbüz',
      title: 'Team.Member.BesimGurbuzTitle',
      photoUrl: 'assets/members/besim-gurbuz.jpeg',
      links: [
        {
          icon: 'twitter',
          href: 'https://twitter.com/besimdev',
        },
        {
          icon: 'github',
          href: 'https://github.com/besimgurbuz',
        },
      ],
    },
  ];
  cosntributorsService = inject(ContributorsService);
  contributors$ = this.cosntributorsService.fetchContributors$();
  contributorsLoading$ = this.cosntributorsService.contributorsLoading$;
}
