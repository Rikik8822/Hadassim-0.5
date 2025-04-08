create table person (
    personid int primary key,
    personalname varchar(50),
    familyname varchar(50),
    gender varchar(10),
    fatherid int,
    motherid int,
    spouseid ints
);

alter table person alter column gender char(1);
alter table person 
add constraint gender check (gender in ('m', 'f'));

create table relationships (
    personid int,
    relativeid int,
    connectiontype varchar(10),
    primary key (personid, relativeid),
    foreign key (personid) references person(personid) on delete no action,
    foreign key (relativeid) references person(personid) on delete no action
);

go

-- Create trigger to manage family relationships
create trigger InsertFamilyRelationshipsTrigger
on person
for insert
as
begin
    declare @personId int, @fatherId int, @motherId int, @spouseId int, @i INT, @currentPersonId int, @gender char(1);
    select @personId = personId, @fatherId = fatherId, @motherId = motherId, @spouseId = spouseId from inserted;

    -- Ensure that the spouseId is correctly updated for both persons
    if @spouseId is not null and @personId != @spouseId
    begin
        update person
            set spouseid = @personId
        where personid = @spouseId;
    end

    -- If father exists, insert 'father' relationship
    if @fatherId is not null
    begin
        insert into relationships 
        values (@personId, @fatherId, 'father');
    end

    -- If mother exists, insert 'mother' relationship
    if @motherId is not null
    begin
        insert into  relationships 
        values (@personId, @motherId, 'mother');
    end

    -- If spouse exists
    if @spouseId is not null
    begin
        update person
            set spouseid = @personId
        where personid = @spouseId;

        declare @changeRow int = @@rowcount;

        if @gender = 'm'
        begin
            insert into relationships values(@personId, @spouseId, 'wife');
            if @changeRow != 0
                insert into relationships values(@spouseId, @personId, 'husband');
        end
        else
        begin
            insert into relationships values(@personId, @spouseId, 'husband');
            if @changeRow != 0
                insert into relationships values(@spouseId, @personId, 'wife');
        end
    end

    -- If there's a father or mother, insert sibling relationships
    if @motherId is not null or @fatherId is not null
    begin
        set @i = (select count(*) from person where fatherid = @fatherId or motherid = @motherId);
        while @i > 0
        begin
            select @currentPersonId = personid, @gender = gender
            from (
                select personid, gender, row_number() over (order by personid) as rowNumber
                from person
                where (fatherid = @fatherId or motherid = @motherId)
                and @personId != personid
            ) as newT
            where @i = rowNumber;

            -- Add sibling relationship
            if (@currentPersonId is not null)
                insert into relationships
                values (
                    @personId,
                    @currentPersonId,
                    case 
                        when @gender = 'M' then 'brother'  -- If gender is male
                        when @gender = 'F' then 'sister'   -- If gender is female
                    end
                );

            -- Decrement @i
            set @i = @i - 1;
        end
    end
end;
go

-- Create foreign key constraints between tables
alter table person
add constraint fk_People_Father foreign key (fatherId) references person(personId);
alter table person
add constraint fk_People_Mother foreign key (motherId) references person(personId);
alter table person 
add constraint fk_People_Spouse foreign key (spouseId) references person(personId);







