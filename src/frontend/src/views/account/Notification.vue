<template>
      <!-- No separate overlay, all spinner notifications will be handled by the toast -->
    </template>
    
    <script>
    import { OrbitSpinner } from 'epic-spinners';
    import { useToast } from 'vue-toastification';
    
    export default {
      name: 'Notification',
      components: {
        OrbitSpinner,
      },
      props: {
        loadingMessage: {
          type: String,
          default: 'Processing your request...',
        },
        outcomeMessage: {
          type: String,
          default: 'Operation complete.',
        },
      },
      methods: {
        showLoadingToast() {
          const toast = useToast();
    
          this.toastId = toast({
            component: {
              template: `
                <div class="toast-content">
                  <OrbitSpinner :animation-duration="1000" color="#151927" size="50" class="glowing-spinner" />
                  <p class="loading-text">{{ loadingMessage }}</p>
                </div>
              `,
              components: { OrbitSpinner },
              data() {
                return {
                  loadingMessage: this.loadingMessage,
                };
              },
            },
            options: {
              timeout: false,  // Keep the toast until manually dismissed or updated
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              position: 'bottom-right',
            },
          });
        },
        updateToast(outcomeMessage) {
          const toast = useToast();
          if (this.toastId) {
            toast.update(this.toastId, {
              component: {
                template: `
                  <div class="toast-content">
                    <p class="outcome-message">{{ outcomeMessage }}</p>
                  </div>
                `,
                data() {
                  return {
                    outcomeMessage: outcomeMessage,
                  };
                },
              },
              options: {
                timeout: 5000,
                type: 'success',  // Set the type to success or error based on result
              },
            });
          }
        },
      },
    };
    </script>
    
    <style scoped>
    .toast-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .loading-text {
      margin-top: 12px;
      color: #fff;
      font-size: 16px;
    }
    
    .outcome-message {
      font-size: 18px;
      color: #fff;
    }
    
    .glowing-spinner {
      filter: drop-shadow(0 0 10px rgba(21, 25, 39, 0.5));
    }
    </style>
    