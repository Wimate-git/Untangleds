import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILayout, LayoutType } from '../../core/configs/config';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  // public props
  appSidebarDisplay: boolean;
  appSidebarDefaultFixedDesktop: boolean;
  appSidebarDefaultMinimizeDesktopEnabled: boolean;
  appSidebarDefaultMinimizeDesktopDefault: boolean;
  appSidebarDefaultMinimizeDesktopHoverable: boolean;
  appSidebarDefaultMinimizeMobileEnabled: boolean;
  appSidebarDefaultMinimizeMobileDefault: boolean;
  appSidebarDefaultMinimizeMobileHoverable: boolean;
  appSidebarDefaultCollapseDesktopEnabled: boolean;
  appSidebarDefaultCollapseDesktopDefault: boolean;
  appSidebarDefaultCollapseMobileEnabled: boolean;
  appSidebarDefaultCollapseMobileDefault: boolean;

  appSidebarDefaultPushHeader: boolean;
  appSidebarDefaultPushToolbar: boolean;
  appSidebarDefaultPushFooter: boolean;

  appSidebarDefaultStacked: boolean;

  // logo
  appSidebarDefaultMinimizeDefault: boolean = true;
  toggleButtonClass: string;
  toggleEnabled: boolean;
  toggleType: string;
  toggleState: string;

  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    const subscr = this.layout.layoutConfigSubject
      .asObservable()
      .subscribe((config: ILayout) => {
        this.updateProps(config);
      });
    this.unsubscribe.push(subscr);


    // Set the sidebar to minimized by default
  this.appSidebarDefaultMinimizeDefault = true; // Ensure sidebar is minimized initially
  this.toggleButtonClass = 'active'; // Set the toggle button class to activew
  }

  updateProps(config: ILayout) {
    // Check if the sidebar should be displayed
    this.appSidebarDisplay = this.layout.getProp('app.sidebar.display', config) as boolean;
    if (!this.appSidebarDisplay) {
        return; // Exit if the sidebar is not displayed
    }

    // Get the fixed state for desktop
    this.appSidebarDefaultFixedDesktop = this.layout.getProp(
        'app.sidebar.default.fixed.desktop',
        config
    ) as boolean;

    // Minimize settings for desktop
    this.appSidebarDefaultMinimizeDesktopEnabled = this.layout.getProp(
        'app.sidebar.default.minimize.desktop.enabled',
        config
    ) as boolean;

    // Set minimize state to true by default
    this.appSidebarDefaultMinimizeDesktopDefault = true; // Sidebar starts minimized

    if (this.appSidebarDefaultMinimizeDesktopEnabled) {
        // Apply the minimized state
        if (this.appSidebarDefaultMinimizeDesktopDefault) {
            document.body.setAttribute('data-kt-app-sidebar-minimize', 'on');
        }

        // Check if the sidebar is hoverable
        this.appSidebarDefaultMinimizeDesktopHoverable = this.layout.getProp(
            'app.sidebar.default.minimize.desktop.hoverable',
            config
        ) as boolean;
        if (this.appSidebarDefaultMinimizeDesktopHoverable) {
            document.body.setAttribute('data-kt-app-sidebar-hoverable', 'true');
        }
    }

    // Minimize settings for mobile
    this.appSidebarDefaultMinimizeMobileEnabled = this.layout.getProp(
        'app.sidebar.default.minimize.mobile.enabled',
        config
    ) as boolean;

    if (this.appSidebarDefaultMinimizeMobileEnabled) {
        this.appSidebarDefaultMinimizeMobileDefault = this.layout.getProp(
            'app.sidebar.default.minimize.mobile.default',
            config
        ) as boolean;

        if (this.appSidebarDefaultMinimizeMobileDefault) {
            document.body.setAttribute('data-kt-app-sidebar-minimize-mobile', 'on');
        }

        this.appSidebarDefaultMinimizeMobileHoverable = this.layout.getProp(
            'app.sidebar.default.minimize.mobile.hoverable',
            config
        ) as boolean;

        if (this.appSidebarDefaultMinimizeMobileHoverable) {
            document.body.setAttribute(
                'data-kt-app-sidebar-hoverable-mobile',
                'true'
            );
        }
    }

    // Collapse settings for desktop
    this.appSidebarDefaultCollapseDesktopEnabled = this.layout.getProp(
        'app.sidebar.default.collapse.desktop.enabled',
        config
    ) as boolean;

    if (this.appSidebarDefaultCollapseDesktopEnabled) {
        this.appSidebarDefaultCollapseDesktopDefault = this.layout.getProp(
            'app.sidebar.default.collapse.desktop.default',
            config
        ) as boolean;

        if (this.appSidebarDefaultCollapseDesktopDefault) {
            document.body.setAttribute('data-kt-app-sidebar-collapse', 'on');
        }
    }

    // Collapse settings for mobile
    this.appSidebarDefaultCollapseMobileEnabled = this.layout.getProp(
        'app.sidebar.default.collapse.mobile.enabled',
        config
    ) as boolean;

    if (this.appSidebarDefaultCollapseMobileEnabled) {
        this.appSidebarDefaultCollapseMobileDefault = this.layout.getProp(
            'app.sidebar.default.collapse.mobile.default',
            config
        ) as boolean;

        if (this.appSidebarDefaultCollapseMobileDefault) {
            document.body.setAttribute('data-kt-app-sidebar-collapse-mobile', 'on');
        }
    }

    // Push settings
    if (this.layout.getProp('app.sidebar.default.push')) {
        this.appSidebarDefaultPushHeader = this.layout.getProp(
            'app.sidebar.default.push.header',
            config
        ) as boolean;
        if (this.appSidebarDefaultPushHeader) {
            document.body.setAttribute('data-kt-app-sidebar-push-header', 'true');
        }

        this.appSidebarDefaultPushToolbar = this.layout.getProp(
            'app.sidebar.default.push.toolbar',
            config
        ) as boolean;
        if (this.appSidebarDefaultPushToolbar) {
            document.body.setAttribute('data-kt-app-sidebar-push-toolbar', 'true');
        }

        this.appSidebarDefaultPushFooter = this.layout.getProp(
            'app.sidebar.default.push.footer',
            config
        ) as boolean;
        if (this.appSidebarDefaultPushFooter) {
            document.body.setAttribute('data-kt-app-sidebar-push-footer', 'true');
        }
    }

    // Stacked settings
    this.appSidebarDefaultStacked = this.layout.getProp(
        'app.sidebar.default.stacked',
        config
    ) as boolean;
    if (this.appSidebarDefaultStacked) {
        document.body.setAttribute('app-sidebar-stacked', 'true');
    }

    // Ensure minimized state for the logo
    this.appSidebarDefaultMinimizeDefault = this.appSidebarDefaultMinimizeDesktopDefault;

    // Set the toggle button class based on minimized state
    this.toggleButtonClass = this.appSidebarDefaultMinimizeDefault ? 'active' : '';

    console.log("This is the sidebar status ", this.appSidebarDefaultMinimizeDefault);
    console.log("Toggle button class is ", this.toggleButtonClass);

    // Determine if the toggle is enabled
    this.toggleEnabled =
        this.appSidebarDefaultMinimizeDesktopEnabled ||
        this.appSidebarDefaultCollapseDesktopEnabled;

    // Set toggle type and state
    if (this.appSidebarDefaultMinimizeDesktopEnabled) {
        this.toggleType = 'minimize';
        this.toggleState = 'active';
    }

    if (this.appSidebarDefaultCollapseDesktopEnabled) {
        this.toggleType = 'collapse';
        this.toggleState = '';
    }

    // Set final attributes on the document body
    document.body.setAttribute('data-kt-app-sidebar-enabled', 'true');
    document.body.setAttribute(
        'data-kt-app-sidebar-fixed',
        this.appSidebarDefaultFixedDesktop.toString()
    );
}


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
