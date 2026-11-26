This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Super user

Username: kp
Email address: kp@gmail.com
Password: qwe123

# VENV ACTIVATION

source venv/bin/activate <-- INSIDE BACKEND FOLDER


# SERVICES & PRICING

# SNEAKERS:

- Sneaker basic wash - outsole wash, mid sole, mid upper and laces R 120

- Sneaker deep clean wash - outsole, insole, mid upper, laces, deodorizer R 190

- Sneaker restoration - Deep clean + deodorizer R340 coming soon!

# CARS:

- Car interior wash - vaccum, stain wash, restore - R 250

- Car exterior wash - wash & shine - R 150

- Car detailing - vacuum, deep stain wash, restore, wash & shine, wax polish - R 1000

# INTERACTIVE SHELL TO CHANGE CARD DESCRIPTION

from bookings.models import Service

# Update the existing services to match your new pricing and descriptions
Service.objects.filter(name="Sneaker Basic Wash").update(price=120, description="Outsole, midsole, mid-upper, undersole, & laces.")
Service.objects.filter(name="Sneaker Deep Clean").update(price=190, description="Outsole, midsole, mid-upper, undersole, and laces, Main focus on stains & dirt, sole whitener + deodoriser.")
Service.objects.filter(name="Sneaker Restoration. Coming suun").update(price=340, description="Deep clean + deodorizer.")

# Note: Your old DB might have "Car Interior Clean" instead of "Wash"
Service.objects.filter(name__icontains="Car Interior").update(name="Car Interior Wash", price=250, description="Vacuum, deep wash, restore freshness.")
Service.objects.filter(name__icontains="Car Exterior").update(name="Car Exterior Wash", price=150, description="Hand Wash & polish.")
Service.objects.filter(name__contains="Full Car Detail").update(name="Car Detailing", category="mobile_detailing", price=700, description="Vacuum, deep wash, restore paint depth, hand wash & polish.")

# Add any missing services
if not Service.objects.filter(name="Car Detailing").exists():
    Service.objects.create(name="Car Detailing", category="mobile_detailing", price=700, duration_minutes=180, description="Vacuum, deep wash, restore, wash & wax polish.")

print("Services updated successfully!")

# RESET SETTINGS.PY
- Cannot register user -- DONE

# Custom Domain
Right now, your site is spotless-zeta.vercel.app.

If you have purchased a domain (like spotless.co.za), go to Vercel → Settings → Domains and add it there. You just need to update your DNS records with your domain provider.

Don't forget to add your new domain to ALLOWED_HOSTS and CORS_ALLOWED_ORIGINS in your settings.py!


# VERCEL SUPERUSER
- Username: kopis
- Email: kopis@gmail.com
- Password: qwe123




# TODOS

- Calender reminder: This will remind clients of their booking at spotless.
- Email Confirmations: This will send the "Booking Confirmed" email to the user automaticallyc -- NEEDS REVIEW
- Custom Domain Like spotless.co.za
- WhatsApp Integration: To receive booking notifications
- Favicon
- interactive cards pop up - prompt: I want to also include these interactive cards to pop up as services, like the pic provided above- simple and clean- but it should follow my site colours and fonts



# DONE FEATURES:

- Social media links instagram -- DONE
- Exact time schedule updated in backend -- DONE
- Embedd south african map for location services, currently in cape town -- DONE
- Generate a QR code -- DONE
- No booking unless you have an account -- DONE
- If a user is registered and has made more than 2 bookings, the address, phone number should be saved in theeir profile to remember when filling out a booking agaon, so that they dont fill out a form again for example: if user has bookeed 1 interior wash and 1 exterior wash, the neon database should put it under one user when it recognizes the username, email, phone number, address of the user, in neon database when i click on a user e.g tumisang, i should be able to see all his booking history it should not be separate -- DONE NEEDS REVIEW TO CHECK FUNCTIONALITY
- My-bookings[if a booking is completed and paid, it should not be editable, it falls under booking histoty]
- whatsapp business number
- Instagram account

