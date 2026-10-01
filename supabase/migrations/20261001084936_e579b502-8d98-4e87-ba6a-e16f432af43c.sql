DROP POLICY IF EXISTS "Signed-in staff can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Signed-in staff can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Signed-in staff can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
DROP POLICY IF EXISTS "Staff can manage products" ON public.products;
DROP POLICY IF EXISTS "Staff can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;