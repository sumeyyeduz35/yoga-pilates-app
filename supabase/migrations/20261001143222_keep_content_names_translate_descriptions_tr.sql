-- =========================================================
-- Keep content names in English
-- Translate descriptions and instructions to Turkish
-- =========================================================

-- ---------------------------------------------------------
-- Exercise Categories
-- ---------------------------------------------------------

-- Yoga

update public.exercise_categories
set
  name = 'Flexibility',
  description = 'Hareket kabiliyetini ve esnekliği geliştirmeye odaklanan yoga çalışmaları.'
where slug = 'flexibility'
  and discipline_id = (
    select id from public.disciplines where slug = 'yoga'
  );

update public.exercise_categories
set
  name = 'Balance',
  description = 'Denge, stabilite ve vücut kontrolünü geliştirmeye odaklanan yoga çalışmaları.'
where slug = 'balance'
  and discipline_id = (
    select id from public.disciplines where slug = 'yoga'
  );

update public.exercise_categories
set
  name = 'Relaxation',
  description = 'Rahatlama ve toparlanmaya odaklanan hafif yoga çalışmaları.'
where slug = 'relaxation'
  and discipline_id = (
    select id from public.disciplines where slug = 'yoga'
  );


-- Pilates

update public.exercise_categories
set
  name = 'Core',
  description = 'Merkez bölge gücü ve gövde stabilitesine odaklanan Pilates hareketleri.'
where slug = 'core'
  and discipline_id = (
    select id from public.disciplines where slug = 'pilates'
  );

update public.exercise_categories
set
  name = 'Mobility',
  description = 'Kontrollü hareket kabiliyeti ve hareket kalitesine odaklanan Pilates hareketleri.'
where slug = 'mobility'
  and discipline_id = (
    select id from public.disciplines where slug = 'pilates'
  );

update public.exercise_categories
set
  name = 'Full Body',
  description = 'Birden fazla büyük kas grubunu birlikte çalıştıran Pilates hareketleri.'
where slug = 'full-body'
  and discipline_id = (
    select id from public.disciplines where slug = 'pilates'
  );


-- Reformer

update public.exercise_categories
set
  name = 'Core',
  description = 'Merkez bölge kontrolü ve stabilitesine odaklanan Reformer hareketleri.'
where slug = 'core'
  and discipline_id = (
    select id from public.disciplines where slug = 'reformer'
  );

update public.exercise_categories
set
  name = 'Upper Body',
  description = 'Üst vücut gücü ve kontrolüne odaklanan Reformer hareketleri.'
where slug = 'upper-body'
  and discipline_id = (
    select id from public.disciplines where slug = 'reformer'
  );

update public.exercise_categories
set
  name = 'Lower Body',
  description = 'Alt vücut gücü ve kontrolüne odaklanan Reformer hareketleri.'
where slug = 'lower-body'
  and discipline_id = (
    select id from public.disciplines where slug = 'reformer'
  );


-- ---------------------------------------------------------
-- Exercises
-- ---------------------------------------------------------

-- Yoga

update public.exercises
set
  name = 'Cat-Cow Stretch',
  description = 'Omurganın hareketliliğini geliştirmeye yardımcı olan nazik bir yoga hareketi.',
  instructions = 'Nefesinle uyumlu şekilde omurganı kontrollü olarak yuvarla ve ters yönde aç. Hareket boyunca yavaş ve kontrollü ilerle.'
where slug = 'cat-cow-stretch';

update public.exercises
set
  name = 'Tree Pose',
  description = 'Denge ve stabiliteye odaklanan ayakta yapılan bir yoga duruşu.',
  instructions = 'Dik dur. Bir ayağını diğer bacağının iç kısmına yerleştir ve gövdeni dik tutarak dengeni koru.'
where slug = 'tree-pose';

update public.exercises
set
  name = 'Child Pose',
  description = 'Rahatlama ve toparlanma için kullanılan nazik bir dinlenme yoga duruşu.',
  instructions = 'Kalçanı topuklarına doğru indir, kollarını öne uzat ve vücudunu rahat bırakarak pozisyonda dinlen.'
where slug = 'child-pose';


-- Pilates

update public.exercises
set
  name = 'The Hundred',
  description = 'Merkez bölge kontrolüne odaklanan klasik bir Pilates hareketi.',
  instructions = 'Karın bölgeni aktif tut. Kollarınla kontrollü küçük vuruşlar yaparken nefesini düzenli şekilde sürdür.'
where slug = 'the-hundred';

update public.exercises
set
  name = 'Spine Stretch Forward',
  description = 'Omurga hareketliliğini geliştirmeye yönelik kontrollü bir Pilates hareketi.',
  instructions = 'Bacaklarını öne uzatarak dik otur. Omurganı kontrollü şekilde öne doğru yuvarlayarak hareketi tamamla.'
where slug = 'spine-stretch-forward';

update public.exercises
set
  name = 'Swimming',
  description = 'Arka kas zinciri ve gövde kontrolünü birlikte çalıştıran bir Pilates hareketi.',
  instructions = 'Yüzüstü uzan. Gövde kontrolünü koruyarak karşı kol ve bacağını dönüşümlü şekilde yukarı kaldır.'
where slug = 'swimming';


-- Reformer

update public.exercises
set
  name = 'Reformer Knee Stretch',
  description = 'Merkez bölge stabilitesi ve taşıyıcı platform kontrolüne odaklanan bir Reformer hareketi.',
  instructions = 'Gövdeni sabit tutarken taşıyıcı platformu kontrollü bir hareket aralığında ileri ve geri hareket ettir.'
where slug = 'reformer-knee-stretch';

update public.exercises
set
  name = 'Reformer Arm Pull',
  description = 'Kontrollü üst vücut kuvvetine odaklanan bir Reformer hareketi.',
  instructions = 'Kayışların direncine karşı çekiş yaparken duruşunu koru ve omuz hareketlerini kontrollü şekilde gerçekleştir.'
where slug = 'reformer-arm-pull';

update public.exercises
set
  name = 'Reformer Footwork',
  description = 'Alt vücudu kontrollü şekilde çalıştırmaya yönelik temel bir Reformer hareketi.',
  instructions = 'Bacaklarını kontrollü şekilde uzatarak taşıyıcı platformu it ve vücut hizanı bozmadan başlangıç pozisyonuna dön.'
where slug = 'reformer-footwork';


-- ---------------------------------------------------------
-- Programs
-- ---------------------------------------------------------

update public.programs
set
  title = 'Yoga Foundations',
  description = 'Temel yoga hareketlerini öğrenmeye yönelik başlangıç seviyesine uygun bir program.'
where slug = 'yoga-foundations';

update public.programs
set
  title = 'Pilates Core Foundations',
  description = 'Merkez bölge kontrolü ve hareket kabiliyetine odaklanan başlangıç seviyesinde bir Pilates programı.'
where slug = 'pilates-core-foundations';

update public.programs
set
  title = 'Reformer Foundations',
  description = 'Kontrollü tüm vücut hareketlerini tanıtan başlangıç seviyesinde bir Reformer programı.'
where slug = 'reformer-foundations';