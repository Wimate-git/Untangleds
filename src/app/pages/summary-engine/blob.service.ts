import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlobService {
  constructor(private http: HttpClient) {}

  async createBlobUrl(): Promise<string> {
    try {
      console.log('Fetching HTML, CSS & JS files...');

      // Fetch HTML and JS
      const html$ = this.http.get('/assets/formbuilder/renderData.html', { responseType: 'text' });
      const js$ = this.http.get('/assets/formbuilder/renderData.js', { responseType: 'text' });

      let htmlContent = await lastValueFrom(html$);
      const jsContent = await lastValueFrom(js$);

      console.log('✅ HTML Loaded:', htmlContent);
      console.log('✅ JS Loaded:', jsContent);

      // 🔹 Fetch and inject styles dynamically
      const cssUrls = [
        '/assets/formbuilder/assets/plugins/custom/datatables/datatables.bundle.css',
        '/assets/formbuilder/assets/plugins/global/plugins.bundle.css',
        '/assets/formbuilder/assets/css/style.bundle.css'
      ];

      let cssContent = '';
      for (let url of cssUrls) {
        try {
          const cssText = await lastValueFrom(this.http.get(url, { responseType: 'text' }));
          cssContent += `<style>${cssText}</style>\n`;
        } catch (error) {
          console.error(`❌ Error loading CSS: ${url}`, error);
        }
      }

      // 🔹 Ensure scripts load in the correct order
      const scriptUrls = [
        'https://code.jquery.com/jquery-3.6.0.min.js', // Load jQuery first
        '/assets/formbuilder/assets/plugins/global/plugins.bundle.js', // Metronic dependencies
        '/assets/formbuilder/assets/js/scripts.bundle.js', // Core scripts
        '/assets/formbuilder/assets/plugins/custom/datatables/datatables.bundle.js', // Datatables

        '/assets/formbuilder/assets/js/widgets.bundle.js',
        '/assets/formbuilder/assets/js/custom/widgets.js',
        '/assets/formbuilder/assets/js/custom/apps/chat/chat.js',
        '/assets/formbuilder/assets/js/custom/utilities/modals/upgrade-plan.js',
        '/assets/formbuilder/assets/js/custom/utilities/modals/create-app.js',
        '/assets/formbuilder/assets/js/custom/utilities/modals/users-search.js'
      ];

      let scriptContents = '';
      for (let url of scriptUrls) {
        try {
          const scriptText = await lastValueFrom(this.http.get(url, { responseType: 'text' }));
          scriptContents += `<script>${scriptText}</script>\n`;
        } catch (error) {
          console.error(`❌ Error loading script: ${url}`, error);
        }
      }

      // 🔹 Ensure Metronic functions initialize properly
      const reinitializeMetronicScripts = `
        <script>
          document.addEventListener('DOMContentLoaded', function () {
            console.log('🚀 Page Loaded inside Blob');

            setTimeout(() => {
              try {
                if (typeof KTMenu !== 'undefined') {
                  KTMenu.init(); 
                }
                if (typeof KTApp !== 'undefined') {
                  KTApp.init(); 
                }
                if (typeof KTWidgets !== 'undefined') {
                  KTWidgets.init();
                }
                if (typeof KTDatatables !== 'undefined') {
                  KTDatatables.init();
                }
              } catch (e) {
                console.error('❌ Error initializing Metronic:', e);
              }
            }, 500);
          });
        </script>
      `;

      // 🔹 Construct full HTML
      const completeHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Workflow</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="The most advanced Bootstrap 5 Admin Theme..." />
          <meta name="keywords" content="metronic, bootstrap, angular, vue, react, flask, node.js" />

          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Metronic - Bootstrap Admin Template" />
          <meta property="og:url" content="https://keenthemes.com/metronic" />
          <meta property="og:site_name" content="Keenthemes | Metronic" />
          
          <link rel="canonical" href="https://preview.keenthemes.com/metronic8" />
          <link rel="shortcut icon" href="/assets/formbuilder/assets/media/logos/wimate-logo-210px.png" />
          
          <!-- Fonts -->
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700" />

          <!-- ✅ Inline CSS -->
          ${cssContent}

          <!-- ✅ Ensure Metronic scripts execute -->
          ${reinitializeMetronicScripts}

          <style>
            /* Your inline styles */
            .btn:hover { transform: translateY(-2px); transition: .5s; }
            .error-border { border: 1px solid red !important; }
            .workflow-details-container.card { border: 1px solid #ddd; padding: 15px; }
          </style>
        </head>
        <body>
          ${htmlContent}

          <!-- ✅ Inject JavaScript -->
          ${scriptContents}
        </body>
        </html>
      `;

      console.log('✅ Final Blob HTML:', completeHtml);

      // Convert to Blob
      const blob = new Blob([completeHtml], { type: 'text/html' });

      // Generate and return Blob URL
      const blobUrl = URL.createObjectURL(blob);
      console.log('✅ Generated Blob URL:', blobUrl);

      return blobUrl;
    } catch (error) {
      console.error('❌ Error fetching assets:', error);
      return '';
    }
  }
}
