module selmi::selmi {
    //use std::table;
    use std::signer;
    //use aptos_framework::randomness;
    use std::vector;
    use std::debug;
    use std::string::{utf8};
    use aptos_framework::event;
    use std::option;
    use aptos_token_objects::collection::{Self};
    use aptos_framework::object;
    use aptos_token_objects::token::{Self, Token};
    use aptos_std::smart_vector;

    const DOES_NOT_EXIST: u64 = 1;
    const INCORRECT_ITEM: u64 = 2;

    const DESCRIPTION: vector<u8> = b"description";

    // FROM HERE

    struct Listing has copy, store, key {
        price: u64,
        description: vector<u8>,
        status: u64,
        //documents: vector<Document>,
        //offers: vector<Offer>,
        //estimates: vector<Estimate>,
        //ai: vector<Ai>,
        //legal_offers: vector<CompanyOffer>,
        //legal_operator: Company
    }

    struct Listings has key {
        listings: smart_vector::SmartVector<Listing>,
    }

    struct Document has store {
        description: vector<u8>,
        link: vector<u8>
    }

    struct Company has key {
        description: vector<u8>,
        documents: smart_vector::SmartVector<Document>,
        reviews: smart_vector::SmartVector<Review>
    }

    struct Offer {
        description: vector<u8>,
        price: u64
    }

    struct Estimate {
        company: Company,
        price: u64,
        description: vector<u8>,
        attached_documents: vector<Document>
    }

    struct Ai {
        ai_name: vector<u8>,
        input: vector<u8>,
        result: vector<u8>
    }

    struct Review has store {
        description: vector<u8>
    }

    struct CompanyOffer {
        name: Company,
        price: u64
    }

    struct ListingOwners has key {
        addresses: smart_vector::SmartVector<address>
    }

    fun init_module(deployer: &signer) {
        move_to(deployer, ListingOwners {
            addresses: smart_vector::new(),
        });
    }

    public entry fun create_listing(user: &signer, price: u64) acquires ListingOwners, Listings {
        let listing_owners = borrow_global_mut<ListingOwners>(@selmi);
        let user_address = signer::address_of(user);

        if (!smart_vector::contains(&listing_owners.addresses, &signer::address_of(user))) {
            smart_vector::push_back(&mut listing_owners.addresses, signer::address_of(user));
        };

        let new_listing = Listing {
            price: price,
            description: DESCRIPTION,
            status: 1,
        };

        let listings = borrow_global_mut<Listings>(user_address);

        smart_vector::push_back(&mut listings.listings, new_listing);
    }

    public entry fun create_company(user: &signer) {
        let user_address = signer::address_of(user);

        let new_company = Company {
            description: DESCRIPTION,
            documents: smart_vector::new(),
            reviews: smart_vector::new()
        };

        move_to(user, new_company);
    }

    #[view]
    public fun get_owners_list(): vector<address> acquires ListingOwners {
        if (exists<ListingOwners>(@selmi)) {
            smart_vector::to_vector(&borrow_global<ListingOwners>(@selmi).addresses)
        } else {
            vector[]
        }
    }

    #[view]
    public fun get_user_listings(user: address): vector<Listing> acquires Listings {
        smart_vector::to_vector(&borrow_global<Listings>(user).listings)
    }
}
