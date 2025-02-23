'use client'

import { Share } from "lucide-react"
import { ICONS_SIZES } from "@/utils/constants"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "../shadcn/dialog"
import { Button } from "../shadcn/button"
import { useTranslations } from "next-intl"
import { showToast } from "@/utils/functions"
import {
  useEffect, useState 
} from "react"

export const ShareProfile = ({ username }:{username: string}) => {
  const t = useTranslations();
  const [baseUrl, setBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  if (!baseUrl) {
    return null;
  }

  const url = baseUrl + '/' + username

  return (
    <Dialog>
      <DialogTrigger 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 w-9"
      >
        <Share size={ICONS_SIZES.sm}/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("profile.share_profile_title")}</DialogTitle>
          <DialogDescription>{t("profile.share_profile_description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant='default' 
            value={url} 
            onClick={()=>{
              navigator.clipboard.writeText(url)
              showToast(200, t("profile.share_profile_cta_confirmation"))
            }}
          >
            {t('profile.share_profile_cta')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  
  )
}
