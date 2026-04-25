"use client"

import { faUser, faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CardComponent, FormSupervisionComponent, ButtonComponent } from "@components";
import { useAuthContext } from "@contexts";

export default function LoginPage() {
  const { setAccessToken } = useAuthContext();

  const handleLoginSuccess = (e: any) => {
    setAccessToken(e.data?.token);

    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="w-full md:max-w-[500px] z-10">
        <div className="text-center mb-10 h-[45vh] md:h-auto flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center w-20 h-16 bg-white rounded-2xl border !border-primary mb-4 group hover:scale-110 transition-transform duration-300">
            <span className="text-2xl font-black text-primary group-hover:text-secondary transition-colors">SIM</span>
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Rental System</h1>
          <p className="text-lg font-medium mt-1">Sewa IPhone Madiun</p>
        </div>

        <CardComponent className="p-8 pt-10 h-[50vh] md:h-auto rounded-t-3xl md:rounded-3xl border-0">
          <FormSupervisionComponent
            submitControl={{ 
              path: "login",
            }}
            payload={(values) => {
              return values;
            }}
            onSuccess={handleLoginSuccess}
            fields={[
              {
                col: 12,
                construction: {
                  name: "username",
                  label: "Username",
                  placeholder: "Masukkan username",
                  leftIcon: faUser,
                  className: "rounded-xl py-3 pl-14 pr-6 icon::left-6"
                }
              },
              {
                col: 12,
                construction: {
                  type: "password",
                  name: "password",
                  label: "Password",
                  placeholder: "Masukkan password",
                  leftIcon: faLock,
                  className: "rounded-xl py-3 pl-14 pr-6 icon::left-6"
                }
              }
            ]}
            footerControl={({ loading }) => (
              <div className="pt-4">
                <ButtonComponent
                  type="submit"
                  label="Masuk Sekarang"
                  icon={faArrowRight}
                  loading={loading}
                  block
                  size="lg"
                  className="bg-gradient-to-br from-primary to-secondary to-75%"
                  rounded
                />
              </div>
            )}
          />

          <p className="text-center mt-16 text-slate-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} RSSIM - SEJE Digital. All rights reserved.
          </p>
        </CardComponent>
        
        
      </div>
    </main>
  );
}
