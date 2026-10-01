-- =========================================================
-- Turkish Content Localization
-- Yoga + Pilates + Reformer
-- =========================================================

-- ---------------------------------------------------------
-- Exercise Categories
-- ---------------------------------------------------------

-- Yoga

update public.exercise_categories
set
  name = 'Esneklik',
  description = 'Hareket kabiliyetini ve esnekliği geliştirmeye odaklanan yoga çalışmaları.'
where slug = 'flexibility'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'yoga'
  );

update public.exercise_categories
set
  name = 'Denge',
  description = 'Denge, stabilite ve vücut kontrolünü geliştirmeye odaklanan yoga çalışmaları.'
where slug = 'balance'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'yoga'
  );

update public.exercise_categories
set
  name = 'Rahatlama',
  description = 'Rahatlama ve toparlanmaya odaklanan hafif yoga çalışmaları.'
where slug = 'relaxation'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'yoga'
  );


-- Pilates

update public.exercise_categories
set
  name = 'Merkez Bölge',
  description = 'Merkez bölge gücü ve gövde stabilitesine odaklanan Pilates hareketleri.'
where slug = 'core'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'pilates'
  );

update public.exercise_categories
set
  name = 'Mobilite',
  description = 'Kontrollü hareket kabiliyeti ve hareket kalitesine odaklanan Pilates hareketleri.'
where slug = 'mobility'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'pilates'
  );

update public.exercise_categories
set
  name = 'Tüm Vücut',
  description = 'Birden fazla büyük kas grubunu birlikte çalıştıran Pilates hareketleri.'
where slug = 'full-body'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'pilates'
  );


-- Reformer

update public.exercise_categories
set
  name = 'Merkez Bölge',
  description = 'Merkez bölge kontrolü ve stabilitesine odaklanan Reformer hareketleri.'
where slug = 'core'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'reformer'
  );

update public.exercise_categories
set
  name = 'Üst Vücut',
  description = 'Üst vücut gücü ve kontrolüne odaklanan Reformer hareketleri.'
where slug = 'upper-body'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'reformer'
  );

update public.exercise_categories
set
  name = 'Alt Vücut',
  description = 'Alt vücut gücü ve kontrolüne odaklanan Reformer hareketleri.'
where slug = 'lower-body'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'reformer'
  );


-- ---------------------------------------------------------
-- Exercises
-- ---------------------------------------------------------

-- Yoga

update public.exercises
set
  name = 'Kedi-İnek Esnemesi',
  description = 'Omurganın hareketliliğini geliştirmeye yardımcı olan nazik bir yoga hareketi.',
  instructions = 'Nefesinle uyumlu şekilde omurganı kontrollü olarak yuvarla ve ters yönde aç. Hareket boyunca yavaş ve kontrollü ilerle.'
where slug = 'cat-cow-stretch'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'yoga'
  );

update public.exercises
set
  name = 'Ağaç Duruşu',
  description = 'Denge ve stabiliteye odaklanan ayakta yapılan bir yoga duruşu.',
  instructions = 'Dik dur. Bir ayağını diğer bacağının iç kısmına yerleştir ve gövdeni dik tutarak dengeni koru.'
where slug = 'tree-pose'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'yoga'
  );

update public.exercises
set
  name = 'Çocuk Duruşu',
  description = 'Rahatlama ve toparlanma için kullanılan nazik bir dinlenme yoga duruşu.',
  instructions = 'Kalçanı topuklarına doğru indir, kollarını öne uzat ve vücudunu rahat bırakarak pozisyonda dinlen.'
where slug = 'child-pose'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'yoga'
  );


-- Pilates

update public.exercises
set
  name = 'Yüz Hareketi',
  description = 'Merkez bölge kontrolüne odaklanan klasik bir Pilates hareketi.',
  instructions = 'Karın bölgeni aktif tut. Kollarınla kontrollü küçük vuruşlar yaparken nefesini düzenli şekilde sürdür.'
where slug = 'the-hundred'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'pilates'
  );

update public.exercises
set
  name = 'Öne Omurga Esnetme',
  description = 'Omurga hareketliliğini geliştirmeye yönelik kontrollü bir Pilates hareketi.',
  instructions = 'Bacaklarını öne uzatarak dik otur. Omurganı kontrollü şekilde öne doğru yuvarlayarak hareketi tamamla.'
where slug = 'spine-stretch-forward'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'pilates'
  );

update public.exercises
set
  name = 'Yüzme',
  description = 'Arka kas zinciri ve gövde kontrolünü birlikte çalıştıran bir Pilates hareketi.',
  instructions = 'Yüzüstü uzan. Gövde kontrolünü koruyarak karşı kol ve bacağını dönüşümlü şekilde yukarı kaldır.'
where slug = 'swimming'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'pilates'
  );


-- Reformer

update public.exercises
set
  name = 'Reformer Diz Esnetme',
  description = 'Merkez bölge stabilitesi ve taşıyıcı platform kontrolüne odaklanan bir Reformer hareketi.',
  instructions = 'Gövdeni sabit tutarken taşıyıcı platformu kontrollü bir hareket aralığında ileri ve geri hareket ettir.'
where slug = 'reformer-knee-stretch'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'reformer'
  );

update public.exercises
set
  name = 'Reformer Kol Çekişi',
  description = 'Kontrollü üst vücut kuvvetine odaklanan bir Reformer hareketi.',
  instructions = 'Kayışların direncine karşı çekiş yaparken duruşunu koru ve omuz hareketlerini kontrollü şekilde gerçekleştir.'
where slug = 'reformer-arm-pull'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'reformer'
  );

update public.exercises
set
  name = 'Reformer Ayak Çalışması',
  description = 'Alt vücudu kontrollü şekilde çalıştırmaya yönelik temel bir Reformer hareketi.',
  instructions = 'Bacaklarını kontrollü şekilde uzatarak taşıyıcı platformu it ve vücut hizanı bozmadan başlangıç pozisyonuna dön.'
where slug = 'reformer-footwork'
  and discipline_id = (
    select id
    from public.disciplines
    where slug = 'reformer'
  );


-- ---------------------------------------------------------
-- Programs
-- ---------------------------------------------------------

update public.programs
set
  title = 'Yoga Temelleri',
  description = 'Temel yoga hareketlerini öğrenmeye yönelik başlangıç seviyesine uygun bir program.'
where slug = 'yoga-foundations';

update public.programs
set
  title = 'Pilates Merkez Bölge Temelleri',
  description = 'Merkez bölge kontrolü ve hareket kabiliyetine odaklanan başlangıç seviyesinde bir Pilates programı.'
where slug = 'pilates-core-foundations';

update public.programs
set
  title = 'Reformer Temelleri',
  description = 'Kontrollü tüm vücut hareketlerini tanıtan başlangıç seviyesinde bir Reformer programı.'
where slug = 'reformer-foundations';